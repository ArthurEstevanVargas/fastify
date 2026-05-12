import type { Database } from '../../types/database';
import type { Author, AuthorRow, CreateAuthorInput, UpdateAuthorInput } from './author.types';

export const mapAuthor = (row: AuthorRow): Author => ({
  id: row.id,
  name: row.name,
  institution: row.institution,
  bio: row.bio,
  credentials: row.credentials,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString()
});

export class AuthorRepository {
  constructor(private readonly db: Database) {}

  async list(): Promise<Author[]> {
    const result = await this.db.query<AuthorRow>(
      `SELECT id, name, institution, bio, credentials, created_at, updated_at
       FROM authors
       WHERE deleted_at IS NULL
       ORDER BY name ASC`
    );

    return result.rows.map(mapAuthor);
  }

  async findById(id: string): Promise<Author | null> {
    const result = await this.db.query<AuthorRow>(
      `SELECT id, name, institution, bio, credentials, created_at, updated_at
       FROM authors
       WHERE id = $1 AND deleted_at IS NULL
       LIMIT 1`,
      [id]
    );

    return result.rows[0] ? mapAuthor(result.rows[0]) : null;
  }

  async create(input: CreateAuthorInput): Promise<Author> {
    const result = await this.db.query<AuthorRow>(
      `INSERT INTO authors (name, institution, bio, credentials)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, institution, bio, credentials, created_at, updated_at`,
      [input.name, input.institution ?? null, input.bio ?? null, input.credentials ?? null]
    );

    return mapAuthor(result.rows[0]);
  }

  async update(id: string, input: UpdateAuthorInput): Promise<Author | null> {
    const current = await this.findById(id);

    if (!current) {
      return null;
    }

    const result = await this.db.query<AuthorRow>(
      `UPDATE authors
       SET name = $2,
           institution = $3,
           bio = $4,
           credentials = $5
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, name, institution, bio, credentials, created_at, updated_at`,
      [
        id,
        input.name ?? current.name,
        input.institution === undefined ? current.institution : input.institution,
        input.bio === undefined ? current.bio : input.bio,
        input.credentials === undefined ? current.credentials : input.credentials
      ]
    );

    return result.rows[0] ? mapAuthor(result.rows[0]) : null;
  }

  async hasActiveArticles(id: string): Promise<boolean> {
    const result = await this.db.query<{ exists: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM articles
         WHERE author_id = $1 AND deleted_at IS NULL
       ) AS "exists"`,
      [id]
    );

    return result.rows[0]?.exists ?? false;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.db.query<AuthorRow>(
      `UPDATE authors
       SET deleted_at = now()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, name, institution, bio, credentials, created_at, updated_at`,
      [id]
    );

    return result.rowCount === 1;
  }
}
