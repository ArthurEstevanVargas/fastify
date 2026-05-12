import type { Database } from '../../types/database';
import type { Category, CategoryRow, CreateCategoryInput, UpdateCategoryInput } from './category.types';

const mapCategory = (row: CategoryRow): Category => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  displayOrder: row.display_order,
  createdAt: row.created_at.toISOString(),
  updatedAt: row.updated_at.toISOString()
});

export class CategoryRepository {
  constructor(private readonly db: Database) {}

  async list(): Promise<Category[]> {
    const result = await this.db.query<CategoryRow>(
      `SELECT id, name, slug, description, display_order, created_at, updated_at
       FROM categories
       WHERE deleted_at IS NULL
       ORDER BY display_order ASC, name ASC`
    );

    return result.rows.map(mapCategory);
  }

  async findByIdOrSlug(idOrSlug: string): Promise<Category | null> {
    const result = await this.db.query<CategoryRow>(
      `SELECT id, name, slug, description, display_order, created_at, updated_at
       FROM categories
       WHERE deleted_at IS NULL AND (id::text = $1 OR slug = $1)
       LIMIT 1`,
      [idOrSlug]
    );

    return result.rows[0] ? mapCategory(result.rows[0]) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const result = await this.db.query<CategoryRow>(
      `SELECT id, name, slug, description, display_order, created_at, updated_at
       FROM categories
       WHERE deleted_at IS NULL AND slug = $1
       LIMIT 1`,
      [slug]
    );

    return result.rows[0] ? mapCategory(result.rows[0]) : null;
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const result = await this.db.query<CategoryRow>(
      `INSERT INTO categories (name, slug, description, display_order)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, slug, description, display_order, created_at, updated_at`,
      [input.name, input.slug, input.description, input.displayOrder ?? 0]
    );

    return mapCategory(result.rows[0]);
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category | null> {
    const current = await this.findByIdOrSlug(id);

    if (!current) {
      return null;
    }

    const result = await this.db.query<CategoryRow>(
      `UPDATE categories
       SET name = $2,
           slug = $3,
           description = $4,
           display_order = $5
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, name, slug, description, display_order, created_at, updated_at`,
      [
        id,
        input.name ?? current.name,
        input.slug ?? current.slug,
        input.description ?? current.description,
        input.displayOrder ?? current.displayOrder
      ]
    );

    return result.rows[0] ? mapCategory(result.rows[0]) : null;
  }

  async hasActiveArticles(id: string): Promise<boolean> {
    const result = await this.db.query<{ exists: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM articles
         WHERE category_id = $1 AND deleted_at IS NULL
       ) AS "exists"`,
      [id]
    );

    return result.rows[0]?.exists ?? false;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.db.query<CategoryRow>(
      `UPDATE categories
       SET deleted_at = now()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, name, slug, description, display_order, created_at, updated_at`,
      [id]
    );

    return result.rowCount === 1;
  }
}
