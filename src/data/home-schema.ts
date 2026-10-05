// Dados estruturados preservados da implementação aprovada.
export const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://unolabs.com.br/#organizacao",
      "name": "UNO Labs",
      "email": "contato@unolabs.com.br",
      "telephone": "+5527936185141",
      "url": "https://unolabs.com.br/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://unolabs.com.br/assets/icons/android-chrome-512x512.png",
        "width": 512,
        "height": 512
      },
      "image": "https://unolabs.com.br/assets/img/og-unolabs.png",
      "description": "Criação de sites profissionais, SEO local, Google Ads, Meta Ads e manutenção para empresas da Grande Vitória, de Curitiba e de todo o Brasil.",
      "founder": [
        {
          "@type": "Person",
          "name": "Urias Loures"
        },
        {
          "@type": "Person",
          "name": "Bruno Gonzaga"
        }
      ],
      "areaServed": [
        {
          "@type": "City",
          "name": "Vitória, ES"
        },
        {
          "@type": "City",
          "name": "Vila Velha, ES"
        },
        {
          "@type": "City",
          "name": "Serra, ES"
        },
        {
          "@type": "City",
          "name": "Cariacica, ES"
        },
        {
          "@type": "City",
          "name": "Curitiba, PR"
        },
        {
          "@type": "Country",
          "name": "Brasil"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Serviços da UNO Labs",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Criação de sites sob medida",
              "description": "Sites institucionais, landing pages e páginas de serviço."
            },
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": 1490,
              "priceCurrency": "BRL"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "SEO local",
              "description": "Estrutura técnica, conteúdo e presença nas buscas da sua cidade."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Gestão de Google Ads",
              "description": "Campanhas de pesquisa para quem já está procurando pelo serviço."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Gestão de Meta Ads",
              "description": "Anúncios no Instagram e no Facebook."
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Manutenção e evolução de sites",
              "description": "Atualizações, segurança, ajustes de conteúdo e melhorias contínuas."
            }
          },
          {
            "@type": "Offer",
            "url": "https://unolabs.com.br/whatsapp/",
            "itemOffered": {
              "@type": "Service",
              "name": "Canal WhatsApp gerenciado",
              "description": "Número dedicado, perfil comercial, histórico e respostas básicas de horário para empresas de Curitiba."
            },
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": 97,
              "maxPrice": 197,
              "priceCurrency": "BRL"
            }
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://unolabs.com.br/#site",
      "url": "https://unolabs.com.br/",
      "name": "UNO Labs",
      "inLanguage": "pt-BR",
      "publisher": {
        "@id": "https://unolabs.com.br/#organizacao"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://unolabs.com.br/#pagina",
      "url": "https://unolabs.com.br/",
      "name": "Criação de Sites, SEO e Google Ads em Vitória e Vila Velha | UNO Labs",
      "isPartOf": {
        "@id": "https://unolabs.com.br/#site"
      },
      "about": {
        "@id": "https://unolabs.com.br/#organizacao"
      },
      "inLanguage": "pt-BR",
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://unolabs.com.br/assets/img/og-unolabs.png"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://unolabs.com.br/#duvidas",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Quanto custa um projeto?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Projetos começam em R$ 1.490, em até 10x sem juros. O valor final depende do número de páginas, do conteúdo, da direção visual e das funcionalidades. Você recebe a proposta fechada antes de começar."
          }
        },
        {
          "@type": "Question",
          "name": "Quanto tempo leva?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "O prazo depende do escopo, do conteúdo e das validações. O cronograma fica definido na proposta antes do início."
          }
        },
        {
          "@type": "Question",
          "name": "O que a garantia cobre?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A garantia cobre a correção de falhas no que foi entregue. Prazo e condições ficam na proposta. Alterações de conteúdo, novas páginas e funções são contratadas à parte no plano de manutenção ou em outro serviço."
          }
        },
        {
          "@type": "Question",
          "name": "Vocês garantem a primeira posição no Google?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Não. A posição depende de fatores que nenhuma empresa controla sozinha. Entregamos a base técnica, o conteúdo e o acompanhamento que aumentam as chances de sua empresa aparecer nas buscas da sua região."
          }
        },
        {
          "@type": "Question",
          "name": "Como funcionam os anúncios no Google e no Meta?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Planejamos, criamos e acompanhamos as campanhas. A verba de mídia fica separada da gestão. A forma de pagamento será definida na proposta."
          }
        },
        {
          "@type": "Question",
          "name": "Vocês ajudam com o conteúdo?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim. Organizamos a mensagem e a estrutura das páginas. Textos completos, fotos e vídeos podem entrar no escopo, se combinados na proposta."
          }
        },
        {
          "@type": "Question",
          "name": "O site fica no nome da minha empresa?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim. Domínio e acessos ficam com a sua empresa, e entregamos tudo documentado."
          }
        },
        {
          "@type": "Question",
          "name": "Os projetos mostrados são de clientes reais?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Os três estudos desta página são conceituais: criados por nós para mostrar direção e acabamento. Cases de clientes serão publicados com autorização."
          }
        },
        {
          "@type": "Question",
          "name": "Atendem fora do Espírito Santo e de Curitiba?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sim. Atendemos todo o Brasil de forma remota. Na Grande Vitória e em Curitiba, também presencialmente."
          }
        }
      ]
    }
  ]
} as const;
