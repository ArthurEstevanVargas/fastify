# Requirements: Minha Saúde Feminina API

## Introduction

A API Minha Saúde Feminina deve fornecer a primeira versão funcional completa de um backend REST para uma plataforma de educação em saúde feminina. A solução deve expor uma base estruturada para gerenciamento e consulta de conteúdo médico educativo, organizado por categorias, artigos, autores e fontes/referências.

Esta fase define apenas os requisitos da API. A implementação deve ser feita em fase posterior, utilizando Fastify, TypeScript, PostgreSQL, migrations SQL versionadas e compatibilidade com execução local e deploy no Railway. A arquitetura deve permanecer simples, modular, explícita e incremental, evitando abstrações desnecessárias e mantendo preparação para evolução futura.

## Requirements

### Requirement 1

**User Story:** As a usuária leitora, I want consultar categorias de saúde feminina, so that eu possa navegar por conteúdos educativos organizados por tema.

#### Acceptance Criteria

1. WHEN a cliente solicitar a listagem de categorias, THEN o sistema SHALL retornar todas as categorias disponíveis em uma estrutura consistente e paginável quando aplicável.
2. WHEN a cliente solicitar uma categoria por identificador, THEN o sistema SHALL retornar os dados da categoria correspondente.
3. IF a categoria solicitada não existir, THEN o sistema SHALL retornar erro 404 em formato padronizado.
4. WHEN a API for inicializada com dados do MVP, THEN o sistema SHALL disponibilizar as categorias Saúde Menstrual, Saúde Sexual, Gravidez, Pós-parto, Prevenção e Menopausa.
5. WHEN uma categoria for criada ou atualizada, THEN o sistema SHALL validar nome, slug e descrição antes de persistir os dados.
6. IF uma operação tentar criar uma categoria com slug já existente, THEN o sistema SHALL rejeitar a operação com erro de conflito.
7. WHEN uma categoria possuir artigos vinculados, THEN o sistema SHALL impedir exclusão física que quebre integridade referencial.

### Requirement 2

**User Story:** As a curadora de conteúdo, I want gerenciar artigos educativos, so that o conteúdo da plataforma possa ser criado, atualizado, destacado e organizado por categoria.

#### Acceptance Criteria

1. WHEN uma cliente solicitar a listagem de artigos, THEN o sistema SHALL retornar artigos com filtros opcionais por categoria, autor, destaque e status de publicação.
2. WHEN uma cliente solicitar um artigo por identificador ou slug, THEN o sistema SHALL retornar título, resumo, conteúdo, categoria, autor, fontes, flags de destaque e metadados auditáveis.
3. IF o artigo solicitado não existir, THEN o sistema SHALL retornar erro 404 em formato padronizado.
4. WHEN um artigo for criado, THEN o sistema SHALL exigir título, slug, resumo, conteúdo, categoria válida e autor válido.
5. WHEN um artigo for atualizado, THEN o sistema SHALL validar o payload e preservar integridade com categoria, autor e fontes existentes.
6. IF uma operação tentar persistir artigo com slug duplicado, THEN o sistema SHALL rejeitar a operação com erro de conflito.
7. WHEN artigos forem listados, THEN o sistema SHALL aplicar paginação para evitar payloads grandes.
8. WHEN artigos forem retornados em endpoints públicos de leitura, THEN o sistema SHALL retornar apenas artigos publicados, salvo requisito explícito de administração em fase futura.
9. WHERE artigos forem removidos, THEN o sistema SHALL utilizar estratégia compatível com auditoria e integridade dos relacionamentos.

### Requirement 3

**User Story:** As a usuária leitora, I want buscar artigos por texto, so that eu possa encontrar rapidamente conteúdos relevantes por título, resumo ou conteúdo.

#### Acceptance Criteria

1. WHEN a cliente enviar um termo de busca, THEN o sistema SHALL pesquisar artigos por título, resumo e conteúdo.
2. WHEN a busca textual for executada, THEN o sistema SHALL tratar diferenças de caixa de texto de forma insensível a maiúsculas e minúsculas.
3. IF o termo de busca estiver vazio ou inválido, THEN o sistema SHALL retornar erro de validação ou uma resposta vazia conforme contrato definido.
4. WHEN houver resultados, THEN o sistema SHALL retornar dados suficientes para exibição em lista, incluindo identificador, título, resumo, categoria e metadados de publicação.
5. WHEN não houver resultados, THEN o sistema SHALL retornar lista vazia com status HTTP adequado.
6. WHERE a busca textual for implementada no PostgreSQL, THEN o sistema SHALL utilizar índices apropriados para título, resumo e conteúdo.
7. WHEN a busca retornar múltiplos artigos, THEN o sistema SHALL aplicar paginação e ordenação previsível.

### Requirement 4

**User Story:** As a curadora de conteúdo, I want gerenciar autores, so that cada artigo tenha atribuição clara e confiável.

#### Acceptance Criteria

1. WHEN a cliente solicitar a listagem de autores, THEN o sistema SHALL retornar autores com estrutura consistente.
2. WHEN a cliente solicitar um autor por identificador, THEN o sistema SHALL retornar os dados do autor correspondente.
3. IF o autor solicitado não existir, THEN o sistema SHALL retornar erro 404 em formato padronizado.
4. WHEN um autor for criado, THEN o sistema SHALL exigir nome e validar campos opcionais como instituição, biografia e credenciais.
5. WHEN um autor for atualizado, THEN o sistema SHALL validar o payload antes da persistência.
6. IF uma operação tentar excluir um autor vinculado a artigos, THEN o sistema SHALL preservar a integridade dos artigos e rejeitar ou restringir a exclusão conforme regra documentada.
7. WHEN artigos exibirem autoria, THEN o sistema SHALL permitir identificar o autor responsável pelo conteúdo.

### Requirement 5

**User Story:** As a usuária leitora, I want visualizar fontes e referências dos artigos, so that eu possa confiar na origem das informações de saúde.

#### Acceptance Criteria

1. WHEN a cliente solicitar fontes de um artigo, THEN o sistema SHALL retornar as referências vinculadas ao artigo.
2. WHEN uma fonte for criada, THEN o sistema SHALL exigir vínculo com artigo existente e dados mínimos da referência.
3. IF a fonte possuir URL, THEN o sistema SHALL validar o formato da URL antes de persistir.
4. WHEN uma fonte for atualizada, THEN o sistema SHALL validar descrição, URL, título e demais campos definidos no contrato.
5. IF o artigo vinculado à fonte não existir, THEN o sistema SHALL rejeitar a operação com erro de validação ou referência inválida.
6. WHEN um artigo for retornado em detalhe, THEN o sistema SHALL incluir suas fontes/referências associadas.
7. WHERE fontes forem removidas, THEN o sistema SHALL manter consistência com o artigo relacionado.

### Requirement 6

**User Story:** As a cliente integradora, I want rotas REST completas para os domínios principais, so that a aplicação frontend possa consumir a API de forma previsível.

#### Acceptance Criteria

1. WHEN a API for implementada, THEN o sistema SHALL expor rotas REST versionadas sob o prefixo `/api/v1`.
2. WHEN o domínio for categories, THEN o sistema SHALL expor operações REST completas para criação, leitura, atualização, listagem e remoção conforme regra de integridade.
3. WHEN o domínio for articles, THEN o sistema SHALL expor operações REST completas para criação, leitura, atualização, listagem, remoção e busca textual.
4. WHEN o domínio for authors, THEN o sistema SHALL expor operações REST completas para criação, leitura, atualização, listagem e remoção conforme regra de integridade.
5. WHEN o domínio for article_sources, THEN o sistema SHALL expor operações REST completas para criação, leitura, atualização, listagem e remoção.
6. WHEN uma rota receber body, params ou query, THEN o sistema SHALL validar a entrada por schema.
7. WHEN uma rota retornar resposta, THEN o sistema SHALL documentar e serializar os status codes esperados.
8. IF ocorrer erro de validação, conflito, recurso inexistente ou erro interno, THEN o sistema SHALL retornar resposta padronizada sem stack trace.

### Requirement 7

**User Story:** As a engenheira mantenedora, I want persistir os dados exclusivamente em PostgreSQL, so that a API tenha consistência relacional e esteja preparada para produção.

#### Acceptance Criteria

1. WHEN dados de categorias, artigos, autores ou fontes forem persistidos, THEN o sistema SHALL utilizar exclusivamente PostgreSQL.
2. WHEN a modelagem inicial for criada, THEN o sistema SHALL incluir as tabelas `categories`, `articles`, `authors` e `article_sources`.
3. WHEN chaves primárias forem definidas, THEN o sistema SHALL utilizar UUID conforme padrão do projeto.
4. WHEN tabelas forem definidas, THEN o sistema SHALL utilizar nomes e colunas em `snake_case`.
5. WHEN entidades forem persistidas, THEN o sistema SHALL incluir campos auditáveis `created_at` e `updated_at`.
6. WHERE soft delete for adotado para uma entidade, THEN o sistema SHALL incluir `deleted_at` e documentar seu impacto nas consultas.
7. WHEN relacionamentos forem definidos, THEN o sistema SHALL utilizar foreign keys explícitas e índices nos campos de relacionamento.
8. WHEN constraints forem necessárias, THEN o sistema SHALL declará-las explicitamente em migrations SQL.
9. WHEN buscas, filtros ou ordenações forem previstos, THEN o sistema SHALL criar índices compatíveis com os padrões de acesso.
10. IF uma alteração estrutural do banco for necessária, THEN o sistema SHALL implementá-la por migration SQL versionada.

### Requirement 8

**User Story:** As a engenheira mantenedora, I want uma arquitetura Fastify modular e simples, so that a API permaneça clara, testável e evolutiva.

#### Acceptance Criteria

1. WHEN a API for implementada, THEN o sistema SHALL separar domínios em módulos com rotas, controllers, services, repositories, schemas, DTOs e types.
2. WHEN uma rota for executada, THEN o sistema SHALL manter regra de negócio fora da camada de rota.
3. WHEN regras de negócio forem necessárias, THEN o sistema SHALL concentrá-las em services.
4. WHEN acesso ao banco for necessário, THEN o sistema SHALL concentrá-lo em repositories.
5. WHEN schemas forem definidos, THEN o sistema SHALL reutilizá-los para validação e serialização quando adequado.
6. IF uma abstração nova não reduzir complexidade real ou duplicação relevante, THEN o sistema SHALL evitá-la.
7. WHEN a implementação utilizar TypeScript, THEN o sistema SHALL evitar `any` e manter tipagem explícita em funções públicas.

### Requirement 9

**User Story:** As a operadora da aplicação, I want executar a API localmente e no Railway, so that o ambiente de desenvolvimento e produção sejam previsíveis.

#### Acceptance Criteria

1. WHEN a API for configurada para execução local, THEN o sistema SHALL utilizar variáveis de ambiente para conexão com PostgreSQL e configuração do servidor.
2. WHEN a API for preparada para Railway, THEN o sistema SHALL aceitar `DATABASE_URL`, `PORT`, `NODE_ENV` e demais variáveis necessárias sem hardcode de secrets.
3. WHEN o serviço estiver em execução, THEN o sistema SHALL expor endpoint de healthcheck.
4. WHEN a aplicação iniciar, THEN o sistema SHALL usar build e start scripts determinísticos.
5. WHEN a aplicação registrar logs, THEN o sistema SHALL usar logs estruturados e não expor dados sensíveis.
6. WHEN o processo receber sinal de encerramento, THEN o sistema SHALL encerrar conexões de forma controlada.

### Requirement 10

**User Story:** As a engenheira mantenedora, I want documentação de banco em `docs/database`, so that o modelo relacional e suas decisões fiquem claros para evolução futura.

#### Acceptance Criteria

1. WHEN a fase de documentação técnica for executada, THEN o sistema SHALL criar documentação em `docs/database`.
2. WHEN o schema final for documentado, THEN o sistema SHALL incluir SQL representando tabelas, colunas, constraints, foreign keys e índices.
3. WHEN o MER for documentado, THEN o sistema SHALL representar entidades e relacionamentos entre `categories`, `articles`, `authors` e `article_sources`.
4. WHEN entidades forem descritas, THEN o sistema SHALL incluir propósito, campos, tipos e obrigatoriedade.
5. WHEN relacionamentos forem descritos, THEN o sistema SHALL indicar cardinalidade e comportamento de integridade referencial.
6. WHEN constraints forem descritas, THEN o sistema SHALL explicar unicidade, obrigatoriedade, checks e regras de exclusão.
7. WHEN índices forem descritos, THEN o sistema SHALL justificar cada índice por acesso de leitura, filtro, busca ou relacionamento.
8. WHEN decisões de modelagem forem registradas, THEN o sistema SHALL explicar escolhas como UUID, auditoria, slug, busca textual, soft delete quando aplicável e normalização relacional.

### Requirement 11

**User Story:** As a QA engineer, I want critérios de qualidade e testes mínimos, so that a primeira versão funcional seja verificável antes de produção.

#### Acceptance Criteria

1. WHEN uma rota REST for implementada, THEN o sistema SHALL possuir testes de integração cobrindo sucesso, validação e recurso inexistente.
2. WHEN regras de negócio forem implementadas em services, THEN o sistema SHALL possuir testes unitários para cenários críticos.
3. WHEN constraints de banco forem relevantes para o comportamento da API, THEN o sistema SHALL cobrir os cenários por testes ou documentação verificável.
4. WHEN busca textual for implementada, THEN o sistema SHALL testar busca por título, resumo e conteúdo.
5. WHEN listagem de artigos em destaque for implementada, THEN o sistema SHALL testar retorno filtrado e ordenação previsível.
6. IF um teste exigir PostgreSQL, THEN o sistema SHALL utilizar configuração reproduzível para ambiente local ou CI.

### Requirement 12

**User Story:** As a usuária leitora, I want acessar artigos em destaque, so that eu possa encontrar rapidamente conteúdos importantes na experiência inicial.

#### Acceptance Criteria

1. WHEN a cliente solicitar artigos em destaque, THEN o sistema SHALL retornar apenas artigos marcados como destacados.
2. WHEN artigos em destaque forem retornados, THEN o sistema SHALL incluir identificador, título, resumo, categoria, autor e metadados de publicação.
3. WHEN não houver artigos em destaque, THEN o sistema SHALL retornar lista vazia com status HTTP adequado.
4. WHEN múltiplos artigos em destaque existirem, THEN o sistema SHALL aplicar ordenação previsível.
5. WHERE artigos destacados forem consultados publicamente, THEN o sistema SHALL retornar apenas artigos publicados.

