import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('database schema migration', () => {
  const schema = readFileSync(join(process.cwd(), 'src/infra/database/migrations/001_initial_schema.sql'), 'utf8');

  it('creates required tables and full-text index', () => {
    expect(schema).toContain('CREATE TABLE IF NOT EXISTS categories');
    expect(schema).toContain('CREATE TABLE IF NOT EXISTS authors');
    expect(schema).toContain('CREATE TABLE IF NOT EXISTS articles');
    expect(schema).toContain('CREATE TABLE IF NOT EXISTS article_sources');
    expect(schema).toContain('articles_search_vector_gin_idx');
  });

  it('contains audit and soft delete fields', () => {
    expect(schema).toContain('created_at timestamptz NOT NULL DEFAULT now()');
    expect(schema).toContain('updated_at timestamptz NOT NULL DEFAULT now()');
    expect(schema).toContain('deleted_at timestamptz');
  });
});
