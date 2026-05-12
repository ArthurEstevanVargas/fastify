import type { Database } from '../../types/database';
import type {
  ArticleSource,
  ArticleSourceRow,
  CreateArticleSourceInput,
  UpdateArticleSourceInput
} from './article-source.types';

export const mapArticleSource = (row: ArticleSourceRow): ArticleSource => ({
  id: row.id,
  articleId: row.article_id,
  title: row.title,
  description: row.description,
  url: row.url,
  sourceOrder: row.source_order,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString()
});

export class ArticleSourceRepository {
  constructor(private readonly db: Database) {}

  async list(articleId?: string): Promise<ArticleSource[]> {
    const result = await this.db.query<ArticleSourceRow>(
      `SELECT id, article_id, title, description, url, source_order, created_at, updated_at
       FROM article_sources
       WHERE deleted_at IS NULL AND ($1::uuid IS NULL OR article_id = $1::uuid)
       ORDER BY source_order ASC, title ASC`,
      [articleId ?? null]
    );

    return result.rows.map(mapArticleSource);
  }

  async listByArticleIds(articleIds: readonly string[]): Promise<ArticleSource[]> {
    if (articleIds.length === 0) {
      return [];
    }

    const result = await this.db.query<ArticleSourceRow>(
      `SELECT id, article_id, title, description, url, source_order, created_at, updated_at
       FROM article_sources
       WHERE deleted_at IS NULL AND article_id = ANY($1::uuid[])
       ORDER BY source_order ASC, title ASC`,
      [articleIds]
    );

    return result.rows.map(mapArticleSource);
  }

  async findById(id: string): Promise<ArticleSource | null> {
    const result = await this.db.query<ArticleSourceRow>(
      `SELECT id, article_id, title, description, url, source_order, created_at, updated_at
       FROM article_sources
       WHERE id = $1 AND deleted_at IS NULL
       LIMIT 1`,
      [id]
    );

    return result.rows[0] ? mapArticleSource(result.rows[0]) : null;
  }

  async create(input: CreateArticleSourceInput): Promise<ArticleSource> {
    const result = await this.db.query<ArticleSourceRow>(
      `INSERT INTO article_sources (article_id, title, description, url, source_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, article_id, title, description, url, source_order, created_at, updated_at`,
      [input.articleId, input.title, input.description ?? null, input.url ?? null, input.sourceOrder ?? 0]
    );

    return mapArticleSource(result.rows[0]);
  }

  async update(id: string, input: UpdateArticleSourceInput): Promise<ArticleSource | null> {
    const current = await this.findById(id);

    if (!current) {
      return null;
    }

    const result = await this.db.query<ArticleSourceRow>(
      `UPDATE article_sources
       SET article_id = $2,
           title = $3,
           description = $4,
           url = $5,
           source_order = $6
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, article_id, title, description, url, source_order, created_at, updated_at`,
      [
        id,
        input.articleId ?? current.articleId,
        input.title ?? current.title,
        input.description === undefined ? current.description : input.description,
        input.url === undefined ? current.url : input.url,
        input.sourceOrder ?? current.sourceOrder
      ]
    );

    return result.rows[0] ? mapArticleSource(result.rows[0]) : null;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.db.query<ArticleSourceRow>(
      `UPDATE article_sources
       SET deleted_at = now()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, article_id, title, description, url, source_order, created_at, updated_at`,
      [id]
    );

    return result.rowCount === 1;
  }
}
