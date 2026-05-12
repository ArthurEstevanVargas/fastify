# Decisões de Modelagem

- **UUID como chave primária:** segue o steering do projeto e evita exposição de sequência incremental.
- **PostgreSQL exclusivo:** todas as entidades são relacionais e persistidas por migrations SQL versionadas.
- **Sem JSONB para dados centrais:** categorias, artigos, autores e fontes são modelados em tabelas normalizadas.
- **Audit fields:** todas as tabelas possuem `created_at` e `updated_at`; entidades de conteúdo possuem `deleted_at` para soft delete.
- **Soft delete:** preserva histórico e impede reutilização acidental de registros removidos. Slugs únicos consideram somente registros ativos.
- **Slugs:** usados para URLs legíveis e validados por regex em aplicação e banco.
- **Status de artigo:** `draft`, `published` e `archived` ficam em `text` com `CHECK`, evitando enum rígido para evolução futura.
- **Busca textual:** `search_vector` gerado combina título, resumo e conteúdo com pesos diferentes e índice GIN.
- **Integridade referencial:** categorias e autores restringem exclusão física quando há artigos; fontes são dependentes do artigo.
- **Índices:** criados para slugs, FKs, listagem pública, destaque e busca textual, alinhados aos acessos previstos pela API.
