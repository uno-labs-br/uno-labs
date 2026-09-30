<?php
/**
 * Copie este arquivo para FORA da pasta pública, com o nome "uno-contato-config.php".
 * Na HostGator: /home/SEU_USUARIO/uno-contato-config.php (mesmo nível da pasta public_html).
 * Nunca coloque este arquivo dentro de public_html.
 */
return [
    'n8n_webhook_url'   => 'https://SEU-N8N/webhook/contato-unolabs',
    'n8n_webhook_token' => 'troque-por-um-token-longo-e-aleatorio',
    'turnstile_secret'  => '', // opcional: chave secreta do Cloudflare Turnstile
    'origens_permitidas' => ['https://unolabs.com.br', 'https://www.unolabs.com.br'],
];
