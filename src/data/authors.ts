/** Nomes, cargos e biografias aprovados em 01/10/2026. A autoria é escolhida no MDX. */
export const authors = {
  'urias-loures': {
    name: 'Urias Loures',
    role: 'Cofundador da UNO Labs',
    biography: [
      'Empresário, Urias combina experiência prática em gestão de negócios com mais de seis anos de atuação em Meta Ads e uma trajetória que inclui mais de 1 milhão investidos em marketing.',
      'Na UNO Labs, conecta sua vivência em vendas, atendimento e aquisição de clientes à criação de sites e campanhas, com foco em comunicar o valor da empresa, atrair públicos relevantes e facilitar o contato comercial.',
    ],
  },
  'bruno-gonzaga': {
    name: 'Bruno Gonzaga',
    role: 'Cofundador da UNO Labs',
    biography: [
      'Com duas décadas de experiência em tecnologia e atuação em projetos para Bradesco, HSBC, Dow Jones e uma grande fintech brasileira, Bruno reúne competências em arquitetura de software, sistemas em nuvem, liderança técnica e automação com IA.',
      'Na UNO Labs, aplica essa experiência à construção de sites rápidos, confiáveis e bem estruturados, com atenção à qualidade técnica, à experiência do visitante e à evolução de cada projeto.',
    ],
  },
  'milena-dias': {
    name: 'Milena Dias',
    role: 'Comunicação e Conteúdo',
    biography: [
      'Formanda em Publicidade e Propaganda, Milena combina experiência de marketing e atendimento ao cliente com conhecimentos em UGC e social media.',
      'Na UNO Labs, contribui para uma comunicação clara e próxima do público, ajudando a apresentar o valor de cada empresa e responder às dúvidas de quem está decidindo contratar.',
    ],
  },
} as const;

export type AuthorId = keyof typeof authors;
export const authorIds = ['urias-loures', 'bruno-gonzaga', 'milena-dias'] as const satisfies readonly AuthorId[];
