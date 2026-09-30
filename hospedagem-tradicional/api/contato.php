<?php
/**
 * UNO Labs — recebimento do formulário em hospedagem tradicional (Apache + PHP, ex.: HostGator).
 * Equivale ao worker/index.js da Cloudflare: valida, filtra robôs e encaminha ao webhook do n8n.
 *
 * Instalação: veja LEIA-ME.md (seção "Hospedagem tradicional").
 * As chaves ficam no arquivo uno-contato-config.php, FORA da pasta pública (public_html).
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function responder(int $status, array $corpo, array $extras = []): void
{
    http_response_code($status);
    foreach ($extras as $nome => $valor) header($nome . ': ' . $valor);
    echo json_encode($corpo, JSON_UNESCAPED_UNICODE);
    exit;
}

function limpar($valor, int $maximo, bool $manterLinhas = false): string
{
    $t = is_scalar($valor) ? (string) $valor : '';
    if ($manterLinhas) {
        $t = str_replace(["\r\n", "\r"], "\n", $t);
        $t = preg_replace('/[\x00-\x09\x0B-\x1F\x7F]/u', '', $t) ?? '';
    } else {
        $t = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $t) ?? '';
    }
    return mb_substr(trim($t), 0, $maximo, 'UTF-8');
}

function canalValido(string $v): bool
{
    if (preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u', $v)) return true;
    return strlen(preg_replace('/\D/', '', $v) ?? '') >= 10;
}

function postar(string $url, $corpo, array $cabecalhos, int $tempo = 10): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $corpo,
        CURLOPT_HTTPHEADER => $cabecalhos,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => $tempo,
        CURLOPT_CONNECTTIMEOUT => 5,
    ]);
    $resposta = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $erro = curl_error($ch);
    curl_close($ch);
    return [$status, $resposta === false ? '' : (string) $resposta, $erro];
}

// ---- Configuração ----
$arquivoConfig = dirname(__DIR__, 2) . '/uno-contato-config.php';
if (!is_file($arquivoConfig)) {
    error_log('UNO contato: arquivo de configuração não encontrado em ' . $arquivoConfig);
    responder(503, ['ok' => false, 'erro' => 'nao_configurado']);
}
$config = require $arquivoConfig;

// ---- Método, origem e tamanho ----
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    responder(405, ['ok' => false, 'erro' => 'metodo_nao_permitido'], ['Allow' => 'POST']);
}

$origem = $_SERVER['HTTP_ORIGIN'] ?? '';
$propria = 'https://' . ($_SERVER['HTTP_HOST'] ?? '');
$permitidas = $config['origens_permitidas'] ?? [];
if ($origem === '' || ($origem !== $propria && !in_array($origem, $permitidas, true))) {
    responder(403, ['ok' => false, 'erro' => 'origem_invalida']);
}

if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') === false) {
    responder(415, ['ok' => false, 'erro' => 'tipo_invalido']);
}

$limite = 16 * 1024;
$texto = file_get_contents('php://input', false, null, 0, $limite + 1);
if ($texto === false || strlen($texto) > $limite) responder(413, ['ok' => false, 'erro' => 'muito_grande']);

$d = json_decode($texto, true);
if (!is_array($d)) responder(400, ['ok' => false, 'erro' => 'json_invalido']);

// ---- Armadilha para robôs ----
if (limpar($d['website'] ?? '', 200) !== '') responder(200, ['ok' => true]);

// ---- Validação ----
$servicosValidos = ['site' => 'Site', 'seo' => 'SEO', 'google-ads' => 'Google Ads', 'meta-ads' => 'Meta Ads', 'manutencao' => 'Manutenção'];
$investimentos = [
    '' => 'Não informado', 'ate-3k' => 'Até R$ 3 mil', '3-6k' => 'De R$ 3 mil a R$ 6 mil',
    '6-10k' => 'De R$ 6 mil a R$ 10 mil', '10k' => 'Acima de R$ 10 mil', 'indefinido' => 'Ainda não definido',
];

$servicos = [];
if (isset($d['servicos']) && is_array($d['servicos'])) {
    foreach ($d['servicos'] as $s) {
        if (is_string($s) && isset($servicosValidos[$s]) && !in_array($s, $servicos, true)) $servicos[] = $s;
    }
}
$invest = (isset($d['invest']) && is_string($d['invest']) && isset($investimentos[$d['invest']])) ? $d['invest'] : '';

$dados = [
    'nome' => limpar($d['nome'] ?? '', 120),
    'empresa' => limpar($d['empresa'] ?? '', 160),
    'canal' => limpar($d['canal'] ?? '', 160),
    'site' => limpar($d['site'] ?? '', 300),
    'contexto' => limpar($d['contexto'] ?? '', 4000, true),
    'servicos' => $servicos,
    'invest' => $invest,
];

$campos = [];
if (mb_strlen($dados['nome']) < 2) $campos[] = 'nome';
if (mb_strlen($dados['empresa']) < 2) $campos[] = 'empresa';
if (!canalValido($dados['canal'])) $campos[] = 'canal';
if (mb_strlen($dados['contexto']) < 10) $campos[] = 'contexto';
if ($campos) responder(422, ['ok' => false, 'erro' => 'validacao', 'campos' => $campos]);

// ---- Turnstile (opcional) ----
$segredoTurnstile = (string) ($config['turnstile_secret'] ?? '');
if ($segredoTurnstile !== '') {
    $token = limpar($d['turnstile'] ?? '', 2048);
    if ($token === '') responder(403, ['ok' => false, 'erro' => 'turnstile']);
    [$st, $corpoT] = postar('https://challenges.cloudflare.com/turnstile/v0/siteverify', http_build_query([
        'secret' => $segredoTurnstile,
        'response' => $token,
        'remoteip' => $_SERVER['HTTP_CF_CONNECTING_IP'] ?? ($_SERVER['REMOTE_ADDR'] ?? ''),
    ]), ['Content-Type: application/x-www-form-urlencoded']);
    $jt = json_decode($corpoT, true);
    if ($st !== 200 || !is_array($jt) || ($jt['success'] ?? false) !== true) responder(403, ['ok' => false, 'erro' => 'turnstile']);
}

// ---- Encaminhamento ao n8n ----
$webhook = (string) ($config['n8n_webhook_url'] ?? '');
if ($webhook === '') {
    error_log('UNO contato: n8n_webhook_url vazio');
    responder(503, ['ok' => false, 'erro' => 'nao_configurado']);
}

$payload = $dados + [
    'origem' => $_SERVER['HTTP_HOST'] ?? '',
    'pagina' => limpar($d['pagina'] ?? '', 200),
    'recebidoEm' => gmdate('Y-m-d\TH:i:s\Z'),
    'servicosTexto' => $servicos ? implode(', ', array_map(fn($s) => $servicosValidos[$s], $servicos)) : 'Não informado',
    'investTexto' => $investimentos[$invest],
];

[$status, , $erro] = postar($webhook, json_encode($payload, JSON_UNESCAPED_UNICODE), [
    'Content-Type: application/json',
    'X-Uno-Token: ' . (string) ($config['n8n_webhook_token'] ?? ''),
]);

if ($status < 200 || $status >= 300) {
    error_log('UNO contato: n8n respondeu ' . $status . ($erro ? ' (' . $erro . ')' : ''));
    responder(502, ['ok' => false, 'erro' => 'encaminhamento']);
}

responder(200, ['ok' => true]);
