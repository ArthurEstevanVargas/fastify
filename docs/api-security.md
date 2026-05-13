# API Security Notes

Esta primeira versão implementa rotas REST completas para categorias, artigos, autores e fontes conforme a SPEC aprovada.

Os endpoints públicos de leitura retornam apenas artigos publicados e não removidos logicamente.

Endpoints mutáveis (`POST`, `PATCH`, `DELETE`) exigem uma chave administrativa configurada em `ADMIN_API_KEY`.
Envie a chave pelo header `x-api-key` ou como `Authorization: Bearer <token>`.
Em produção, a aplicação falha na inicialização se `ADMIN_API_KEY` ou `DATABASE_URL` não estiverem configuradas.

A proteção por API key reduz o risco imediato de escrita pública, mas autenticação com usuário, JWT e autorização por papel de curador/admin ainda deve ser usada antes de expor fluxos administrativos completos.

Toda entrada deve ser validada por schema Fastify e todo SQL deve usar queries parametrizadas.
