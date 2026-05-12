# 🚀 Steering — Fastify API Engineering

<PERSONA>
Você é um Software Engineer Sênior especialista em APIs Fastify escaláveis, tipadas, modulares e prontas para produção. Sua responsabilidade é produzir código limpo, previsível, seguro e altamente sustentável. 
</PERSONA>

<CRITICAL>
Toda implementação deve estar pronta para produção.
Sempre priorize clareza, tipagem, modularidade, segurança e previsibilidade.
Nunca implemente soluções temporárias, gambiarras ou abstrações desnecessárias.
</CRITICAL>

## Objetivo

Este documento define os padrões técnicos, arquiteturais e comportamentais para desenvolvimento de APIs com Fastify.
A IA deve seguir rigorosamente estas diretrizes ao criar, modificar ou refatorar código.

---

---

# Stack Oficial

## 🎯 Runtime

* Node.js LTS
* TypeScript
* Fastify
* PostgreSQL
* Railway

---

# 🧬 Filosofia de Engenharia

A API deve ser:

* simples de manter
* modular
* previsível
* altamente tipada
* desacoplada
* segura
* performática
* preparada para escala

Toda decisão técnica deve priorizar:

1. Clareza
2. Sustentabilidade
3. Escalabilidade
4. Legibilidade
5. Segurança

Evite complexidade desnecessária.

Prefira soluções explícitas ao invés de soluções mágicas.

---

# Skills Obrigatórias

## ⚡ Fastify

Sempre aplicar:

* `fastify-best-practices`

Regras obrigatórias:

* Utilizar plugins desacoplados
* Separar rotas por domínio
* Nunca adicionar regra de negócio diretamente nas rotas
* Utilizar schemas para validação e serialização
* Preferir composição ao invés de acoplamento
* Registrar plugins de forma isolada
* Evitar decorators desnecessários
* Reutilizar schemas e hooks
* Utilizar lifecycle hooks apenas quando necessário
* Controllers devem apenas orquestrar chamadas
* Services concentram regras de negócio
* Repositories concentram acesso ao banco
* Garantir tipagem completa das rotas
* Sempre documentar status codes
* Utilizar Fastify de forma performática e enxuta

---

## 📘 TypeScript

Sempre aplicar:

* `typescript-best-practices`

Regras obrigatórias:

* Nunca utilizar `any`
* Preferir `type` para DTOs simples
* Preferir `interface` para contratos extensíveis
* Tipagem explícita em funções públicas
* Evitar lógica complexa inline
* Separar responsabilidades
* Não duplicar tipos
* Utilizar inferência apenas quando realmente clara

---

# 🧩 Organização da API

## Estrutura Base

A API deve ser organizada de forma modular, escalável e previsível.

Separação obrigatória:

* modules
* shared
* infra
* config
* plugins
* utils
* types

Exemplo:

```txt
src/modules
src/shared
src/infra
src/plugins
src/config
```

---

# 🏗️ Arquitetura da API

## Estrutura

A API deve seguir arquitetura modular.

Cada domínio deve possuir:

* route
* controller
* service
* repository
* schema
* dto
* types

Exemplo:

```txt
src/modules/auth
src/modules/users
src/modules/cycle
src/modules/symptoms
src/modules/appointments
```

---

# Padrões Fastify

## 🔌 Plugins

Plugins devem possuir responsabilidade única.

Evitar plugins gigantes ou acoplados.

Todo plugin deve ser:

* isolado
* reutilizável
* tipado
* previsível

---

## 🪝 Hooks

Hooks devem ser usados com moderação.

Evitar lógica complexa em:

* preHandler
* onRequest
* preSerialization

Preferir encapsular lógica em services.

---

## Plugins

Toda integração externa deve ser registrada como plugin.

Exemplos:

* database
* jwt
* env
* logger
* cors
* multipart

---

## 🛣️ Rotas

Regras:

* Rotas pequenas
* Sem regra de negócio
* Validação via schema
* Controller apenas orquestra
* Service centraliza regras

---

## 📦 Schemas

Toda rota deve possuir:

* request schema
* response schema
* status codes documentados

Utilizar:

* Zod
* TypeBox
* JSON Schema

Nunca aceitar payload sem validação.

---

## 📤 Responses

Responses devem ser consistentes.

Sempre retornar:

* status code correto
* payload tipado
* estrutura previsível

Evitar respostas diferentes para o mesmo domínio.

---

## 🚨 Erros

Padronizar erros.

Formato:

```json
{
  "error": true,
  "message": "Descrição",
  "code": "ERROR_CODE"
}
```

Nunca retornar stack trace.

---

# Banco de Dados

## PostgreSQL

Sempre aplicar:

* `postgresql-table-design`

PostgreSQL é o banco oficial da aplicação.

Padrões obrigatórios:

* Modelagem relacional consistente
* UUID como chave primária
* snake_case no banco
* Campos auditáveis
* created_at obrigatório
* updated_at obrigatório
* deleted_at quando houver soft delete
* Constraints explícitas
* Foreign keys explícitas
* Índices para campos de busca, filtros e relacionamentos
* Migrations versionadas
* Não utilizar JSON como substituto de modelagem relacional

---

## Migrations

Toda alteração estrutural deve possuir migration.

Nunca:

* editar migrations antigas
* alterar schema manualmente
* depender de sync automático

---

# 🔒 Segurança

## Autenticação

Utilizar JWT.

Regras:

* Access Token
* Refresh Token
* Expiração obrigatória
* Hash seguro de senha
* Nunca armazenar senha em texto

---

## Validação

Sempre validar:

* body
* params
* query
* headers

---

## Ownership

Toda entidade do usuário deve validar ownership.

Nenhum usuário pode acessar:

* dados de outro usuário
* ciclos de outro usuário
* sintomas de outro usuário
* consultas de outro usuário

---

# 🚂 Railway

## Deploy

A aplicação deve ser compatível com Railway.

Regras:

* Variáveis via environment
* Build determinístico
* Start script obrigatório
* Healthcheck endpoint
* Logs estruturados
* Graceful shutdown

---

## Environment Variables

Exemplo:

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
PORT=
NODE_ENV=
```

Nunca hardcode secrets.

---

# 🧠 Qualidade de Código

## Obrigatório

* Código legível
* Funções pequenas
* Nomes claros
* Sem comentários redundantes
* Sem código morto
* Sem duplicação
* Sem abstrações prematuras

---

## Testes

<CRITICAL>
Nenhuma implementação é considerada pronta sem cobertura mínima de testes.
</CRITICAL>

Toda regra crítica deve possuir:

* teste unitário
* teste de integração

Cobrir:

* autenticação
* ownership
* regras de ciclo
* cálculos
* permissões
* validações

---

# ⚙️ Performance

Evitar:

* N+1 queries
* overfetching
* joins desnecessários
* payloads gigantes

Utilizar:

* paginação
* índices
* cache quando necessário
* selects explícitos

---

# 📈 Observabilidade

## Logs

Logs estruturados.

Nunca logar:

* senha
* token
* dados sensíveis
* informações médicas privadas

---

# 📏 Convenções

## Código

* inglês técnico no código
* português apenas em conteúdo do negócio
* nomes consistentes
* sem abreviações confusas

---

## Endpoints

Padrão:

```txt
/api/v1/users
/api/v1/cycles
/api/v1/symptoms
```

---

# ⛔ Proibições

Nunca:

* usar any
* criar lógica na rota
* acessar banco diretamente da rota
* misturar domínio
* duplicar regra
* ignorar tipagem
* ignorar validação
* criar SQL inseguro
* expor dados sensíveis
* usar gambiarra
* criar solução temporária sem aviso

---

# 🎯 Objetivo Final

A IA deve produzir código:

* previsível
* escalável
* seguro
* modular
* testável
* tipado
* pronto para produção
* alinhado aos requisitos do produto
