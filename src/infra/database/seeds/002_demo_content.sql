INSERT INTO authors (id, name, institution, bio, credentials)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'Dra. Ana Silva',
    'Clinica Vida Plena',
    'Ginecologista e obstetra com foco em educacao em saude para mulheres.',
    'CRM 12345'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Dra. Beatriz Costa',
    'Instituto Cuidar',
    'Medica de familia dedicada a prevencao, acompanhamento longitudinal e linguagem acessivel.',
    'CRM 23456'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Enfa. Camila Rocha',
    'Rede Materna',
    'Enfermeira obstetra com experiencia em pre-natal, parto e pos-parto.',
    'COREN 345678'
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'Equipe Editorial Serena',
    'Serena Conteudo em Saude',
    'Equipe multidisciplinar que revisa conteudos educativos baseados em fontes institucionais.',
    'Revisao tecnica'
  )
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    institution = EXCLUDED.institution,
    bio = EXCLUDED.bio,
    credentials = EXCLUDED.credentials;

WITH demo_articles (
  id,
  category_slug,
  author_id,
  title,
  slug,
  summary,
  content,
  status,
  is_featured,
  published_at
) AS (
  VALUES
    (
      '20000000-0000-0000-0000-000000000001',
      'saude-menstrual',
      '10000000-0000-0000-0000-000000000001',
      'Como acompanhar o ciclo menstrual sem complicar',
      'como-acompanhar-o-ciclo-menstrual-sem-complicar',
      'Um guia simples para registrar sinais do ciclo, entender padroes e saber quando procurar atendimento.',
      $$Acompanhar o ciclo menstrual ajuda a reconhecer padroes do corpo ao longo do mes. Anotar datas, intensidade do fluxo, colicas, alteracoes de humor, sono e sintomas fisicos cria um historico util para conversas com profissionais de saude.

O objetivo nao e transformar o cuidado em uma tarefa dificil. Um registro simples, feito no calendario ou em um aplicativo, ja pode mostrar se o ciclo costuma variar muito, se a dor limita atividades ou se o sangramento mudou de forma importante.

Procure atendimento se houver sangramento muito intenso, dor forte, ausencia de menstruacao sem explicacao, febre, tontura ou mudancas persistentes no padrao habitual.$$,
      'published',
      true,
      '2026-05-14T09:00:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000002',
      'saude-menstrual',
      '10000000-0000-0000-0000-000000000002',
      'Colica menstrual: sinais comuns e pontos de atencao',
      'colica-menstrual-sinais-comuns-e-pontos-de-atencao',
      'Entenda quando a colica pode ser esperada e quais sinais merecem avaliacao profissional.',
      $$A colica menstrual pode acontecer por contracoes do utero durante o periodo menstrual. Para muitas pessoas, ela melhora com calor local, repouso, movimento leve e medicamentos indicados por um profissional.

Quando a dor impede atividades rotineiras, piora com o tempo, aparece fora do periodo menstrual ou vem acompanhada de febre, corrimento com odor forte, desmaio ou sangramento intenso, ela merece avaliacao.

Dor forte nao deve ser normalizada. Um atendimento adequado pode investigar causas como endometriose, miomas, infeccoes ou outras condicoes que precisam de cuidado especifico.$$,
      'published',
      false,
      '2026-05-12T10:00:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000003',
      'saude-menstrual',
      '10000000-0000-0000-0000-000000000004',
      'Fluxo intenso: como observar e conversar na consulta',
      'fluxo-intenso-como-observar-e-conversar-na-consulta',
      'Perguntas praticas para identificar sangramento menstrual intenso e levar informacoes uteis para atendimento.',
      $$Fluxo intenso pode ser percebido quando ha necessidade de trocar absorventes em intervalos muito curtos, vazamentos frequentes, coagulos grandes ou sintomas como cansaco e tontura.

Antes da consulta, vale anotar quantos dias dura o sangramento, quantas trocas sao feitas por dia, se ha dor, se existem coagulos e se o fluxo interfere em trabalho, estudo ou sono.

Essas informacoes ajudam a equipe de saude a avaliar anemia, alteracoes hormonais, miomas, polipos e outras causas possiveis.$$,
      'published',
      false,
      '2026-05-08T09:30:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000004',
      'saude-sexual',
      '10000000-0000-0000-0000-000000000002',
      'Consulta sobre saude sexual: o que voce pode perguntar',
      'consulta-sobre-saude-sexual-o-que-voce-pode-perguntar',
      'Temas que podem ser abordados em consulta, de prevencao a prazer, sem julgamento.',
      $$Saude sexual inclui prevencao de infeccoes, contracepcao, consentimento, dor, prazer, desejo, relacionamentos e duvidas sobre o proprio corpo. Todos esses assuntos podem fazer parte de uma consulta.

Levar perguntas anotadas ajuda quando existe vergonha ou receio. Voce pode perguntar sobre metodos de barreira, testes, vacinas, lubrificantes, dor na relacao, sangramento apos contato sexual ou mudancas de libido.

Um bom atendimento deve acolher, explicar opcoes e respeitar escolhas informadas.$$,
      'published',
      true,
      '2026-05-13T11:00:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000005',
      'saude-sexual',
      '10000000-0000-0000-0000-000000000001',
      'Prevenindo ISTs com informacao clara',
      'prevenindo-ists-com-informacao-clara',
      'Medidas de prevencao, testagem e acompanhamento para reduzir riscos de infeccoes sexualmente transmissiveis.',
      $$A prevencao de infeccoes sexualmente transmissiveis combina informacao, acesso a insumos e acompanhamento. Preservativos internos ou externos, testagem regular, vacinas indicadas e conversa franca com parceiros reduzem riscos.

Algumas infeccoes podem nao causar sintomas no inicio. Por isso, fazer testes de rotina pode ser importante mesmo quando a pessoa se sente bem.

Em caso de feridas, corrimento, dor, ardor ao urinar, verrugas ou exposicao de risco, procure atendimento para orientacao e tratamento adequado.$$,
      'published',
      false,
      '2026-05-07T13:00:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000006',
      'saude-sexual',
      '10000000-0000-0000-0000-000000000004',
      'Contracepcao: escolhendo um metodo com seguranca',
      'contracepcao-escolhendo-um-metodo-com-seguranca',
      'Compare criterios importantes para conversar sobre metodos contraceptivos com a equipe de saude.',
      $$Nao existe um metodo contraceptivo unico que seja ideal para todas as pessoas. A escolha depende de objetivos, historico de saude, rotina, preferencia, acesso e possiveis efeitos adversos.

Durante a consulta, informe se voce fuma, tem enxaqueca com aura, pressao alta, historico de trombose, uso de medicamentos continuos ou desejo de engravidar em breve.

O acompanhamento permite ajustar o metodo quando ele nao se encaixa bem na vida real.$$,
      'published',
      false,
      '2026-05-05T08:45:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000007',
      'gravidez',
      '10000000-0000-0000-0000-000000000003',
      'Primeiras semanas de gravidez: cuidados iniciais',
      'primeiras-semanas-de-gravidez-cuidados-iniciais',
      'Passos iniciais apos um teste positivo e sinais que merecem atendimento rapido.',
      $$Apos um teste positivo, o primeiro passo e agendar acompanhamento pre-natal. A equipe de saude pode confirmar a gestacao, estimar idade gestacional, revisar medicamentos e orientar exames iniciais.

Evite iniciar suplementos, fitoterapicos ou medicamentos por conta propria. Informe doencas previas, alergias, uso de remedios, historico de perdas gestacionais e sintomas atuais.

Procure atendimento imediato se houver sangramento intenso, dor forte, desmaio, febre, falta de ar ou dor no ombro associada a mal-estar.$$,
      'published',
      true,
      '2026-05-11T12:00:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000008',
      'gravidez',
      '10000000-0000-0000-0000-000000000001',
      'Pre-natal: exames e conversas importantes',
      'pre-natal-exames-e-conversas-importantes',
      'O pre-natal acompanha a saude da gestante e do bebe, mas tambem e espaco para duvidas e planejamento.',
      $$Consultas de pre-natal avaliam pressao arterial, crescimento, exames laboratoriais, vacinas, sintomas e bem-estar emocional. Tambem ajudam a planejar alimentacao, atividade fisica, sinais de alerta e local de atendimento.

Leve uma lista de duvidas para cada consulta. Perguntas sobre enjoo, sono, trabalho, relacao sexual, medicamentos, parto e amamentacao sao comuns e importantes.

Manter regularidade nas consultas melhora a identificacao precoce de riscos e fortalece o vinculo com a equipe.$$,
      'published',
      false,
      '2026-05-04T14:00:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000009',
      'gravidez',
      '10000000-0000-0000-0000-000000000004',
      'Sinais de alerta na gestacao',
      'sinais-de-alerta-na-gestacao',
      'Sintomas durante a gravidez que precisam de orientacao ou atendimento com prioridade.',
      $$Alguns sintomas na gestacao exigem avaliacao rapida: sangramento, perda de liquido, dor forte, febre, falta de ar, convulsoes, dor de cabeca intensa, visao turva, inchaco repentino ou reducao importante dos movimentos do bebe.

Nem todo desconforto significa emergencia, mas sinais intensos, persistentes ou diferentes do habitual devem ser levados a serio.

Ter anotado o telefone do servico de referencia e combinar uma rota de atendimento ajuda em momentos de urgencia.$$,
      'published',
      false,
      '2026-04-29T09:00:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000010',
      'pos-parto',
      '10000000-0000-0000-0000-000000000003',
      'Pos-parto real: recuperacao, sono e rede de apoio',
      'pos-parto-real-recuperacao-sono-e-rede-de-apoio',
      'Um panorama pratico dos primeiros dias apos o parto e de quando pedir ajuda.',
      $$O pos-parto envolve recuperacao fisica, mudancas hormonais, adaptacao emocional e cuidado com o bebe. Sono fragmentado, sensibilidade, dor e cansaco podem aparecer, mas a pessoa nao precisa atravessar essa fase sozinha.

Organizar rede de apoio para comida, limpeza, transporte e descanso faz diferenca. A consulta de revisao tambem e importante para avaliar sangramento, cicatriz, pressao, amamentacao e saude mental.

Procure atendimento se houver febre, sangramento muito intenso, dor forte, falta de ar, tristeza persistente, pensamentos de autoagressao ou dificuldade extrema de cuidar de si ou do bebe.$$,
      'published',
      true,
      '2026-05-10T15:30:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000011',
      'pos-parto',
      '10000000-0000-0000-0000-000000000001',
      'Amamentacao: dor, pega e sinais de ajuda',
      'amamentacao-dor-pega-e-sinais-de-ajuda',
      'Dor persistente na amamentacao merece avaliacao; pequenos ajustes podem melhorar muito a experiencia.',
      $$Amamentar pode exigir aprendizado para a pessoa e para o bebe. Dor intensa, fissuras, febre, vermelhidao na mama ou endurecimento importante nao devem ser ignorados.

Avaliacao da pega, posicao, frequencia das mamadas e ganho de peso do bebe ajuda a identificar ajustes. Em muitos casos, orientacao precoce evita piora da dor e reduz ansiedade.

Procure servicos de apoio a amamentacao quando houver duvidas, dor persistente ou preocupacao com a alimentacao do bebe.$$,
      'published',
      false,
      '2026-04-30T10:15:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000012',
      'pos-parto',
      '10000000-0000-0000-0000-000000000002',
      'Saude mental no pos-parto: quando ligar o alerta',
      'saude-mental-no-pos-parto-quando-ligar-o-alerta',
      'Como diferenciar oscilacoes esperadas de sinais que precisam de cuidado profissional.',
      $$Oscilacoes emocionais podem acontecer nos primeiros dias apos o parto, mas tristeza intensa, ansiedade paralisante, culpa constante, irritabilidade extrema ou dificuldade de criar vinculo merecem atencao.

Pedir ajuda nao significa fracasso. Saude mental no pos-parto e parte do cuidado integral e pode envolver escuta, rede de apoio, psicoterapia e, quando indicado, tratamento medicamentoso.

Pensamentos de autoagressao, medo de machucar o bebe ou sensacao de perda de controle exigem atendimento imediato.$$,
      'published',
      false,
      '2026-04-25T11:20:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000013',
      'prevencao',
      '10000000-0000-0000-0000-000000000002',
      'Check-up ginecologico: o que faz sentido acompanhar',
      'check-up-ginecologico-o-que-faz-sentido-acompanhar',
      'Prevencao efetiva depende de idade, historico, sintomas, vacinas e exames indicados.',
      $$Um check-up ginecologico deve ser individualizado. Idade, historico familiar, vida sexual, vacinas, sintomas, uso de medicamentos e planos de gravidez influenciam quais orientacoes e exames fazem sentido.

Mais exames nem sempre significam melhor cuidado. O foco deve ser rastrear o que tem indicacao, atualizar vacinas, avaliar sintomas e construir um plano de acompanhamento.

Leve resultados anteriores e informe mudancas recentes no ciclo, dor, secrecoes, sangramentos ou alteracoes nas mamas.$$,
      'published',
      true,
      '2026-05-09T08:00:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000014',
      'prevencao',
      '10000000-0000-0000-0000-000000000004',
      'Vacina HPV: por que ela importa',
      'vacina-hpv-por-que-ela-importa',
      'A vacina HPV ajuda a prevenir infeccoes associadas a canceres e verrugas genitais.',
      $$A vacina HPV e uma estrategia importante de prevencao. Ela reduz o risco de infeccoes por tipos de HPV associados a lesoes precursoras de cancer e verrugas genitais.

A indicacao varia conforme idade, esquema vacinal previo e politicas publicas vigentes. Mesmo pessoas vacinadas devem seguir as orientacoes de rastreamento quando indicadas.

Converse com a equipe de saude sobre elegibilidade, doses necessarias e onde se vacinar.$$,
      'published',
      false,
      '2026-04-28T13:10:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000015',
      'prevencao',
      '10000000-0000-0000-0000-000000000001',
      'Papanicolau: preparo e resultado sem misterio',
      'papanicolau-preparo-e-resultado-sem-misterio',
      'Entenda para que serve o exame preventivo e como conversar sobre o resultado.',
      $$O exame preventivo do colo do utero busca identificar alteracoes antes que evoluam. A periodicidade e a indicacao dependem da idade, historico e diretrizes adotadas pelo servico de saude.

Antes do exame, siga as orientacoes recebidas pela unidade. Se voce estiver menstruada, com dor, corrimento ou usando medicamentos vaginais, avise a equipe para decidir o melhor momento.

Resultado alterado nao significa automaticamente cancer. Significa que pode ser necessario repetir, acompanhar ou investigar melhor.$$,
      'published',
      false,
      '2026-04-21T09:40:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000016',
      'menopausa',
      '10000000-0000-0000-0000-000000000001',
      'Menopausa e qualidade de vida: sintomas que tem cuidado',
      'menopausa-e-qualidade-de-vida-sintomas-que-tem-cuidado',
      'Ondas de calor, sono, humor e saude ossea podem ser acompanhados com plano individualizado.',
      $$A menopausa faz parte da vida, mas sintomas intensos nao precisam ser suportados sem apoio. Ondas de calor, sono ruim, ressecamento vaginal, mudancas de humor e dor nas relacoes podem ter manejo.

O cuidado tambem inclui saude cardiovascular, saude ossea, atividade fisica, alimentacao, vacinas e rastreamentos indicados.

Tratamentos devem ser individualizados, considerando historico pessoal, preferencias, riscos e beneficios.$$,
      'published',
      true,
      '2026-05-06T16:00:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000017',
      'menopausa',
      '10000000-0000-0000-0000-000000000002',
      'Sono no climaterio: ajustes que podem ajudar',
      'sono-no-climaterio-ajustes-que-podem-ajudar',
      'Mudancas hormonais, calor noturno e ansiedade podem afetar o sono, mas ha caminhos de cuidado.',
      $$No climaterio, o sono pode ser afetado por ondas de calor, suor noturno, ansiedade, dor, apneia, medicamentos ou rotina irregular. Identificar o principal fator ajuda a escolher melhores estrategias.

Medidas como regular horario, reduzir alcool, revisar cafeina, ajustar ambiente e tratar sintomas associados podem melhorar a qualidade do sono.

Quando a insonia persiste, causa prejuizo importante ou vem com humor deprimido, vale buscar avaliacao.$$,
      'published',
      false,
      '2026-04-23T12:30:00.000Z'
    ),
    (
      '20000000-0000-0000-0000-000000000018',
      'menopausa',
      '10000000-0000-0000-0000-000000000004',
      'Saude ossea depois dos 40: prevencao ao longo do tempo',
      'saude-ossea-depois-dos-40-prevencao-ao-longo-do-tempo',
      'Habitos, avaliacao de risco e acompanhamento reduzem impacto de perda de massa ossea.',
      $$A saude ossea e construida ao longo da vida. Alimentacao adequada, atividade fisica com fortalecimento, exposicao solar segura, prevencao de quedas e avaliacao de fatores de risco fazem parte do cuidado.

Historico de fraturas, uso prolongado de corticoides, baixo peso, tabagismo, menopausa precoce e algumas doencas podem aumentar risco de osteoporose.

A equipe de saude pode indicar exames e medidas preventivas de acordo com o perfil individual.$$,
      'published',
      false,
      '2026-04-18T10:00:00.000Z'
    )
)
INSERT INTO articles (
  id,
  category_id,
  author_id,
  title,
  slug,
  summary,
  content,
  status,
  is_featured,
  published_at
)
SELECT
  demo_articles.id::uuid,
  categories.id,
  demo_articles.author_id::uuid,
  demo_articles.title,
  demo_articles.slug,
  demo_articles.summary,
  demo_articles.content,
  demo_articles.status,
  demo_articles.is_featured,
  demo_articles.published_at::timestamptz
FROM demo_articles
JOIN categories ON categories.slug = demo_articles.category_slug
WHERE categories.deleted_at IS NULL
ON CONFLICT (id) DO UPDATE
SET category_id = EXCLUDED.category_id,
    author_id = EXCLUDED.author_id,
    title = EXCLUDED.title,
    slug = EXCLUDED.slug,
    summary = EXCLUDED.summary,
    content = EXCLUDED.content,
    status = EXCLUDED.status,
    is_featured = EXCLUDED.is_featured,
    published_at = EXCLUDED.published_at,
    deleted_at = NULL;

WITH demo_sources (id, article_id, title, description, url, source_order) AS (
  VALUES
    (
      '30000000-0000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000001',
      'Ministerio da Saude - Saude da Mulher',
      'Pagina institucional com informacoes gerais sobre cuidado integral a saude da mulher.',
      'https://www.gov.br/saude',
      1
    ),
    (
      '30000000-0000-0000-0000-000000000002',
      '20000000-0000-0000-0000-000000000002',
      'Manual de atencao basica',
      'Referencia de apoio para abordagem de sintomas e encaminhamento na atencao primaria.',
      'https://www.gov.br/saude',
      1
    ),
    (
      '30000000-0000-0000-0000-000000000003',
      '20000000-0000-0000-0000-000000000004',
      'Organizacao Mundial da Saude - Sexual health',
      'Definicoes e principios gerais de saude sexual publicados pela OMS.',
      'https://www.who.int/health-topics/sexual-health',
      1
    ),
    (
      '30000000-0000-0000-0000-000000000004',
      '20000000-0000-0000-0000-000000000005',
      'CDC - Sexually Transmitted Infections',
      'Informacoes educativas sobre prevencao, testagem e tratamento de ISTs.',
      'https://www.cdc.gov/sti',
      1
    ),
    (
      '30000000-0000-0000-0000-000000000005',
      '20000000-0000-0000-0000-000000000007',
      'Ministerio da Saude - Pre-natal',
      'Orientacoes institucionais sobre acompanhamento durante a gestacao.',
      'https://www.gov.br/saude',
      1
    ),
    (
      '30000000-0000-0000-0000-000000000006',
      '20000000-0000-0000-0000-000000000009',
      'ACOG - Warning Signs During Pregnancy',
      'Material educativo sobre sinais de alerta durante a gestacao.',
      'https://www.acog.org/womens-health',
      1
    ),
    (
      '30000000-0000-0000-0000-000000000007',
      '20000000-0000-0000-0000-000000000010',
      'WHO - Postnatal care',
      'Recomendacoes gerais sobre cuidado no periodo pos-natal.',
      'https://www.who.int/health-topics/maternal-health',
      1
    ),
    (
      '30000000-0000-0000-0000-000000000008',
      '20000000-0000-0000-0000-000000000012',
      'Office on Womens Health - Postpartum depression',
      'Informacoes para reconhecer sinais de depressao pos-parto e buscar ajuda.',
      'https://www.womenshealth.gov/mental-health/mental-health-conditions/postpartum-depression',
      1
    ),
    (
      '30000000-0000-0000-0000-000000000009',
      '20000000-0000-0000-0000-000000000013',
      'Ministerio da Saude - Prevencao',
      'Conteudos institucionais sobre rastreamento, vacinacao e cuidado preventivo.',
      'https://www.gov.br/saude',
      1
    ),
    (
      '30000000-0000-0000-0000-000000000010',
      '20000000-0000-0000-0000-000000000014',
      'Instituto Nacional de Cancer - HPV',
      'Informacoes sobre HPV, prevencao e relacao com cancer do colo do utero.',
      'https://www.gov.br/inca',
      1
    ),
    (
      '30000000-0000-0000-0000-000000000011',
      '20000000-0000-0000-0000-000000000016',
      'The Menopause Society',
      'Material educativo sobre sintomas da menopausa e opcoes de cuidado.',
      'https://www.menopause.org',
      1
    ),
    (
      '30000000-0000-0000-0000-000000000012',
      '20000000-0000-0000-0000-000000000018',
      'NIH - Osteoporosis and Bone Health',
      'Referencia educativa sobre saude ossea, fatores de risco e prevencao.',
      'https://www.bones.nih.gov',
      1
    )
)
INSERT INTO article_sources (id, article_id, title, description, url, source_order)
SELECT
  demo_sources.id::uuid,
  demo_sources.article_id::uuid,
  demo_sources.title,
  demo_sources.description,
  demo_sources.url,
  demo_sources.source_order
FROM demo_sources
JOIN articles ON articles.id = demo_sources.article_id::uuid
WHERE articles.deleted_at IS NULL
ON CONFLICT (id) DO UPDATE
SET article_id = EXCLUDED.article_id,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    url = EXCLUDED.url,
    source_order = EXCLUDED.source_order,
    deleted_at = NULL;
