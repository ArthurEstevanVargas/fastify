import { AppError } from '../../shared/errors/app-error';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from './category.types';
import { CategoryRepository } from './category.repository';

export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  list(): Promise<Category[]> {
    return this.repository.list();
  }

  async get(idOrSlug: string): Promise<Category> {
    const category = await this.repository.findByIdOrSlug(idOrSlug);

    if (!category) {
      throw AppError.notFound('Categoria não encontrada', 'CATEGORY_NOT_FOUND');
    }

    return category;
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const existing = await this.repository.findBySlug(input.slug);

    if (existing) {
      throw AppError.conflict('Slug de categoria já existe', 'SLUG_ALREADY_EXISTS');
    }

    return this.repository.create(input);
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const current = await this.get(id);

    if (input.slug && input.slug !== current.slug) {
      const existing = await this.repository.findBySlug(input.slug);

      if (existing) {
        throw AppError.conflict('Slug de categoria já existe', 'SLUG_ALREADY_EXISTS');
      }
    }

    const updated = await this.repository.update(id, input);

    if (!updated) {
      throw AppError.notFound('Categoria não encontrada', 'CATEGORY_NOT_FOUND');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.get(id);

    if (await this.repository.hasActiveArticles(id)) {
      throw AppError.conflict('Categoria possui artigos vinculados', 'CATEGORY_HAS_ARTICLES');
    }

    await this.repository.softDelete(id);
  }
}
