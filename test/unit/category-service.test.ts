import { describe, expect, it } from 'vitest';
import { CategoryService } from '../../src/modules/categories/category.service';
import type { CategoryRepository } from '../../src/modules/categories/category.repository';
import type { Category } from '../../src/modules/categories/category.types';
import { AppError } from '../../src/shared/errors/app-error';

const category: Category = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Saúde Menstrual',
  slug: 'saude-menstrual',
  description: 'Descrição',
  displayOrder: 1,
  createdAt: '2026-05-12T00:00:00.000Z',
  updatedAt: '2026-05-12T00:00:00.000Z'
};

const createRepository = (overrides: Partial<CategoryRepository>): CategoryRepository => {
  return {
    list: async () => [category],
    findByIdOrSlug: async () => category,
    findBySlug: async () => null,
    create: async () => category,
    update: async () => category,
    hasActiveArticles: async () => false,
    softDelete: async () => true,
    ...overrides
  } as unknown as CategoryRepository;
};

describe('CategoryService', () => {
  it('rejects duplicated slug on create', async () => {
    const service = new CategoryService(createRepository({ findBySlug: async () => category }));

    await expect(
      service.create({
        name: 'Saúde Menstrual',
        slug: 'saude-menstrual',
        description: 'Descrição'
      })
    ).rejects.toMatchObject({
      code: 'SLUG_ALREADY_EXISTS',
      statusCode: 409
    } satisfies Partial<AppError>);
  });

  it('blocks deletion when active articles exist', async () => {
    const service = new CategoryService(createRepository({ hasActiveArticles: async () => true }));

    await expect(service.remove(category.id)).rejects.toMatchObject({
      code: 'CATEGORY_HAS_ARTICLES',
      statusCode: 409
    } satisfies Partial<AppError>);
  });
});
