# Implementation Plan

- [x] 1. Prepare project dependencies, scripts and test foundation
  - Add PostgreSQL client dependency and development test tooling required by the approved design.
  - Add deterministic scripts for build, development, tests, migrations and seed execution.
  - Configure the test runner for TypeScript and Fastify `inject()` integration tests.
  - Add environment variable examples for local execution without hardcoded secrets.
  - Keep existing starter behavior buildable while preparing the new modular structure.
  - _Requirements: 8.7, 9.1, 9.2, 9.4, 11.1, 11.2, 11.6_

- [x] 2. Refactor the Fastify application bootstrap
  - Convert `src/app.ts` into a testable app factory plus a separate server start path.
  - Preserve Fastify autoload or equivalent plugin registration in a predictable order.
  - Register `/api/v1` as the versioned API prefix for domain routes.
  - Add graceful shutdown handling for process signals.
  - Remove or isolate starter sample routes that are outside the API contract.
  - _Requirements: 6.1, 8.1, 9.3, 9.4, 9.5, 9.6, 11.1_

- [x] 3. Implement shared configuration, errors and pagination utilities
  - Create typed environment configuration for `DATABASE_URL`, `PORT` and `NODE_ENV`.
  - Implement a shared application error model with stable error codes.
  - Register a global Fastify error handler that returns the standardized error payload.
  - Implement pagination normalization with default and maximum page sizes.
  - Add unit tests for error mapping and pagination behavior.
  - _Requirements: 2.7, 3.7, 6.6, 6.7, 6.8, 8.6, 8.7, 9.1, 9.2, 11.2_

- [x] 4. Implement PostgreSQL connection infrastructure
  - Create the database plugin with a `pg` pool and typed query helper.
  - Add transaction helper support for repository operations that need atomic writes.
  - Close the database pool during Fastify shutdown.
  - Add the `/health` endpoint with database connectivity verification.
  - Add integration tests for successful and failed healthcheck scenarios where practical.
  - _Requirements: 7.1, 8.3, 8.4, 9.1, 9.2, 9.3, 9.5, 9.6, 11.1_

- [x] 5. Create SQL migrations and MVP seed data
  - Create the initial SQL migration enabling `pgcrypto` and defining `set_updated_at()`.
  - Create `categories`, `authors`, `articles` and `article_sources` tables.
  - Add UUID primary keys, audit columns, soft delete columns, explicit constraints and foreign keys.
  - Add indexes for slugs, relationships, public article listing, featured articles and full-text search.
  - Add generated `search_vector` using PostgreSQL Portuguese full-text search.
  - Add seed SQL for the six MVP categories.
  - Add database verification tests or migration checks for schema, constraints, indexes, triggers and seed data.
  - _Requirements: 1.4, 3.6, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 7.10, 11.3, 11.6_

- [x] 6. Create database documentation in `docs/database`
  - Add `docs/database/schema.sql` reflecting the final SQL schema.
  - Add MER documentation for `categories`, `articles`, `authors` and `article_sources`.
  - Document all entities, columns, required fields and data types.
  - Document relationships, cardinality and referential integrity behavior.
  - Document constraints, indexes and the modeling decisions for UUIDs, slugs, audit fields, soft delete and search.
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8_

- [x] 7. Implement the categories module
  - Create category types, DTOs and JSON Schemas for params, body, query and responses.
  - Implement `CategoryRepository` with parameterized SQL and active-record filtering.
  - Implement `CategoryService` for slug uniqueness, lookups and deletion rules.
  - Implement `CategoryController` and routes for list, detail, create, update and delete.
  - Ensure list responses are consistent and ordered by `display_order` and name.
  - Add unit tests for service rules and integration tests for route success, validation, not found and conflict cases.
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 6.2, 6.6, 6.7, 6.8, 8.1, 8.2, 8.3, 8.4, 8.5, 11.1, 11.2_

- [x] 8. Implement the authors module
  - Create author types, DTOs and JSON Schemas for params, body, query and responses.
  - Implement `AuthorRepository` with explicit selects and soft delete filtering.
  - Implement `AuthorService` for creation, update, lookup and deletion rules.
  - Implement `AuthorController` and routes for list, detail, create, update and delete.
  - Block author deletion when active articles are linked.
  - Add unit tests for service rules and integration tests for route success, validation, not found and conflict cases.
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 6.4, 6.6, 6.7, 6.8, 8.1, 8.2, 8.3, 8.4, 8.5, 11.1, 11.2_

- [x] 9. Implement the articles module core CRUD and listing
  - Create article status constants, types, DTOs and JSON Schemas.
  - Implement `ArticleRepository` with explicit joins for category and author list/detail responses.
  - Implement `ArticleService` for category existence, author existence, slug uniqueness and publication rules.
  - Implement list filters for category, author, featured and status where allowed by the public-read contract.
  - Implement detail lookup by UUID or slug and include category, author and sources.
  - Implement create, update and soft delete routes through controller/service/repository layers.
  - Add unit tests for service rules and integration tests for article CRUD, filters, not found, validation and conflicts.
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 5.6, 6.3, 6.6, 6.7, 6.8, 8.1, 8.2, 8.3, 8.4, 8.5, 11.1, 11.2_

- [x] 10. Implement article search and featured article endpoints
  - Implement `GET /api/v1/articles/search` with `q`, `page` and `pageSize` validation.
  - Use PostgreSQL full-text search over title, summary and content with rank-based ordering.
  - Return list item data with category and publication metadata.
  - Implement empty-result behavior with a successful empty list response.
  - Implement `GET /api/v1/articles/featured` with published and non-deleted filtering.
  - Add integration tests for title, summary and content matches, invalid query, empty result, pagination and featured ordering.
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 6.3, 6.6, 6.7, 6.8, 11.4, 11.5, 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 11. Implement the article sources module
  - Create article source types, DTOs and JSON Schemas for params, body, query and responses.
  - Implement `ArticleSourceRepository` with filtering by article and source order.
  - Implement `ArticleSourceService` for article existence checks and URL validation flow.
  - Implement routes for list, detail, create, update and delete.
  - Ensure article detail responses include active sources in deterministic order.
  - Add unit tests for service rules and integration tests for route success, validation, not found and relationship errors.
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 6.5, 6.6, 6.7, 6.8, 8.1, 8.2, 8.3, 8.4, 8.5, 11.1, 11.2_

- [x] 12. Harden route schemas and response serialization
  - Ensure every route has schemas for request params, query, body and documented response status codes.
  - Reuse shared schema fragments for UUIDs, slugs, pagination and error responses.
  - Validate all mutating payloads before controller execution.
  - Normalize response shapes across list, detail, create, update and delete operations.
  - Verify TypeScript strict mode passes without `any`.
  - _Requirements: 6.6, 6.7, 6.8, 8.5, 8.6, 8.7, 11.1_

- [x] 13. Complete security, logging and Railway readiness
  - Confirm all SQL uses parameterized queries and no user input interpolation.
  - Confirm public reads exclude draft, archived and soft-deleted articles.
  - Ensure logs do not include article content, tokens, connection strings or sensitive request bodies.
  - Confirm configuration is environment-driven and compatible with Railway.
  - Confirm graceful shutdown closes server and database resources cleanly.
  - Document mutating endpoints as requiring future curator/admin authentication before public exposure.
  - _Requirements: 2.8, 6.8, 7.1, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 14. Run final verification and quality checks
  - Run TypeScript build and fix all compile errors.
  - Run unit and integration tests against a reproducible PostgreSQL test setup.
  - Verify migrations can apply from scratch and seed categories correctly.
  - Verify core HTTP flows with Fastify `inject()` or smoke requests: health, categories, articles, search, featured and article detail.
  - Review generated docs and implementation against requirements and design traceability.
  - _Requirements: 1.1, 1.4, 2.1, 2.2, 3.1, 3.5, 4.1, 5.1, 5.6, 6.1, 7.10, 9.3, 10.1, 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 12.1_
