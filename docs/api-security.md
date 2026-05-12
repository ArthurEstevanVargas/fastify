# API Security Notes

Esta primeira versão implementa rotas REST completas para categorias, artigos, autores e fontes conforme a SPEC aprovada.

Os endpoints públicos de leitura retornam apenas artigos publicados e não removidos logicamente.

Endpoints mutáveis (`POST`, `PATCH`, `DELETE`) existem para suportar curadoria e integração futura, mas não devem ser expostos publicamente sem a camada de autenticação e autorização por papel de curador/admin planejada no roadmap.

Toda entrada deve ser validada por schema Fastify e todo SQL deve usar queries parametrizadas.
