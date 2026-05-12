import { createPaginationMeta, type Pagination, type PaginationMeta } from '../../shared/pagination/pagination';
import type { Database } from '../../types/database';
import type { Article, ArticleDetail, ArticleDetailRow, ArticleListItem, ArticleListQuery, ArticleListRow, ArticleRow, CreateArticleInput, UpdateArticleInput } from './article.types';
import { ArticleSourceRepository } from '../article-sources/article-source.repository';

const mapArticle = (row: ArticleRow): Article => ({
  id: row.id,
  categoryId: row.category_id,
  authorId: row.author_id,
  title: row.title,
  slug: row.slug,
  summary: row.summary,
  content: row.content,
  status: row.status,
  isFeatured: row.is_featured,
  publishedAt: row.published_at ? row.published_at.toISOString() : null,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString()
});

const mapListItem = (row: ArticleListRow): ArticleListItem => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  summary: row.summary,
  status: row.status,
  isFeatured: row.is_featured,
  publishedAt: row.published_at ? row.published_at.toISOString() : null,
  category: {
    id: row.category_id,
    name: row.category_name,
    slug: row.category_slug
  },
  author: {
    id: row.author_id,
    name: row.author_name
  }
});

const mapDetail = (row: ArticleDetailRow, sources: ArticleDetail['sources']): ArticleDetail => ({
  ...mapArticle(row),
  category: {
    id: row.category_id,
    name: row.category_name,
    slug: row.category_slug
  },
  author: {
    id: row.author_id,
    name: row.author_name,
    institution: row.author_institution,
    credentials: row.author_credentials
  },
  sources
});

type PaginatedArticles = {
  data: ArticleListItem[];
  pagination: PaginationMeta;
};

export class ArticleRepository {
  constructor(private readonly db: Database) {}

  async findByIdRaw(id: string): Promise<Article | null> {
    const result = await this.db.query<ArticleRow>(
      `SELECT id, category_id, author_id, title, slug, summary, content, status, is_featured, published_at, created_at, updated_at
       FROM articles
       WHERE id = $1 AND deleted_at IS NULL
       LIMIT 1`,
      [id]
    );

    return result.rows[0] ? mapArticle(result.rows[0]) : null;
  }

  async findBySlug(slug: string): Promise<Article | null> {
    const result = await this.db.query<ArticleRow>(
      `SELECT id, category_id, author_id, title, slug, summary, content, status, is_featured, published_at, created_at, updated_at
       FROM articles
       WHERE slug = $1 AND deleted_at IS NULL
       LIMIT 1`,
      [slug]
    );

    return result.rows[0] ? mapArticle(result.rows[0]) : null;
  }

  async findPublicDetailByIdOrSlug(idOrSlug: string): Promise<ArticleDetail | null> {
    const result = await this.db.query<ArticleDetailRow>(
      `SELECT a.id, a.category_id, a.author_id, a.title, a.slug, a.summary, a.content, a.status,
              a.is_featured, a.published_at, a.created_at, a.updated_at,
              c.name AS category_name, c.slug AS category_slug,
              au.name AS author_name, au.institution AS author_institution, au.credentials AS author_credentials
       FROM articles a
       JOIN categories c ON c.id = a.category_id AND c.deleted_at IS NULL
       JOIN authors au ON au.id = a.author_id AND au.deleted_at IS NULL
       WHERE a.deleted_at IS NULL
         AND a.status = 'published'
         AND (a.id::text = $1 OR a.slug = $1)
       LIMIT 1`,
      [idOrSlug]
    );

    const row = result.rows[0];

    if (!row) {
      return null;
    }

    const sourceRepository = new ArticleSourceRepository(this.db);
    const sources = await sourceRepository.list(row.id);
    return mapDetail(row, sources);
  }

  async listPublic(query: ArticleListQuery, pagination: Pagination): Promise<PaginatedArticles> {
    const result = await this.db.query<ArticleListRow>(
      `SELECT a.id, a.title, a.slug, a.summary, a.status, a.is_featured, a.published_at,
              c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
              au.id AS author_id, au.name AS author_name,
              count(*) OVER() AS total_count
       FROM articles a
       JOIN categories c ON c.id = a.category_id AND c.deleted_at IS NULL
       JOIN authors au ON au.id = a.author_id AND au.deleted_at IS NULL
       WHERE a.deleted_at IS NULL
         AND a.status = 'published'
         AND ($1::uuid IS NULL OR a.category_id = $1::uuid)
         AND ($2::text IS NULL OR c.slug = $2::text)
         AND ($3::uuid IS NULL OR a.author_id = $3::uuid)
         AND ($4::boolean IS NULL OR a.is_featured = $4::boolean)
       ORDER BY a.published_at DESC, a.created_at DESC
       LIMIT $5 OFFSET $6`,
      [query.categoryId ?? null, query.categorySlug ?? null, query.authorId ?? null, query.featured ?? null, pagination.limit, pagination.offset]
    );

    const total = Number(result.rows[0]?.total_count ?? 0);

    return {
      data: result.rows.map(mapListItem),
      pagination: createPaginationMeta(pagination, total)
    };
  }

  async searchPublic(term: string, pagination: Pagination): Promise<PaginatedArticles> {
    const result = await this.db.query<ArticleListRow>(
      `SELECT a.id, a.title, a.slug, a.summary, a.status, a.is_featured, a.published_at,
              c.id AS category_id, c.name AS category_name, c.slug AS category_slug,
              au.id AS author_id, au.name AS author_name,
              count(*) OVER() AS total_count
       FROM articles a
       JOIN categories c ON c.id = a.category_id AND c.deleted_at IS NULL
       JOIN authors au ON au.id = a.author_id AND au.deleted_at IS NULL
       WHERE a.deleted_at IS NULL
         AND a.status = 'published'
         AND a.search_vector @@ plainto_tsquery('portuguese', $1)
       ORDER BY ts_rank(a.search_vector, plainto_tsquery('portuguese', $1)) DESC, a.published_at DESC
       LIMIT $2 OFFSET $3`,
      [term, pagination.limit, pagination.offset]
    );

    const total = Number(result.rows[0]?.total_count ?? 0);

    return {
      data: result.rows.map(mapListItem),
      pagination: createPaginationMeta(pagination, total)
    };
  }

  async create(input: CreateArticleInput): Promise<ArticleDetail> {
    const status = input.status ?? 'draft';
    const result = await this.db.query<ArticleDetailRow>(
      `INSERT INTO articles (category_id, author_id, title, slug, summary, content, status, is_featured, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, category_id, author_id, title, slug, summary, content, status, is_featured, published_at, created_at, updated_at,
         (SELECT name FROM categories WHERE id = $1) AS category_name,
         (SELECT slug FROM categories WHERE id = $1) AS category_slug,
         (SELECT name FROM authors WHERE id = $2) AS author_name,
         (SELECT institution FROM authors WHERE id = $2) AS author_institution,
         (SELECT credentials FROM authors WHERE id = $2) AS author_credentials`,
      [
        input.categoryId,
        input.authorId,
        input.title,
        input.slug,
        input.summary,
        input.content,
        status,
        input.isFeatured ?? false,
        input.publishedAt ?? null
      ]
    );

    return mapDetail(result.rows[0], []);
  }

  async update(id: string, input: UpdateArticleInput): Promise<ArticleDetail | null> {
    const current = await this.findByIdRaw(id);

    if (!current) {
      return null;
    }

    const result = await this.db.query<ArticleDetailRow>(
      `UPDATE articles
       SET category_id = $2,
           author_id = $3,
           title = $4,
           slug = $5,
           summary = $6,
           content = $7,
           status = $8,
           is_featured = $9,
           published_at = $10
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, category_id, author_id, title, slug, summary, content, status, is_featured, published_at, created_at, updated_at,
         (SELECT name FROM categories WHERE id = $2) AS category_name,
         (SELECT slug FROM categories WHERE id = $2) AS category_slug,
         (SELECT name FROM authors WHERE id = $3) AS author_name,
         (SELECT institution FROM authors WHERE id = $3) AS author_institution,
         (SELECT credentials FROM authors WHERE id = $3) AS author_credentials`,
      [
        id,
        input.categoryId ?? current.categoryId,
        input.authorId ?? current.authorId,
        input.title ?? current.title,
        input.slug ?? current.slug,
        input.summary ?? current.summary,
        input.content ?? current.content,
        input.status ?? current.status,
        input.isFeatured ?? current.isFeatured,
        input.publishedAt === undefined ? current.publishedAt : input.publishedAt
      ]
    );

    if (!result.rows[0]) {
      return null;
    }

    const sourceRepository = new ArticleSourceRepository(this.db);
    const sources = await sourceRepository.list(id);
    return mapDetail(result.rows[0], sources);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.db.query<ArticleRow>(
      `UPDATE articles
       SET deleted_at = now()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, category_id, author_id, title, slug, summary, content, status, is_featured, published_at, created_at, updated_at`,
      [id]
    );

    return result.rowCount === 1;
  }
}
