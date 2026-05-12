import { AppError } from '../../shared/errors/app-error';
import { normalizePagination } from '../../shared/pagination/pagination';
import type { Database } from '../../types/database';
import { AuthorRepository } from '../authors/author.repository';
import { CategoryRepository } from '../categories/category.repository';
import { ArticleRepository } from './article.repository';
import type {
  ArticleDetail,
  ArticleListQuery,
  ArticleSearchQuery,
  CreateArticleInput,
  UpdateArticleInput
} from './article.types';

export class ArticleService {
  private readonly categoryRepository: CategoryRepository;
  private readonly authorRepository: AuthorRepository;

  constructor(
    private readonly repository: ArticleRepository,
    db: Database
  ) {
    this.categoryRepository = new CategoryRepository(db);
    this.authorRepository = new AuthorRepository(db);
  }

  list(query: ArticleListQuery): ReturnType<ArticleRepository['listPublic']> {
    return this.repository.listPublic(query, normalizePagination(query));
  }

  featured(query: ArticleListQuery): ReturnType<ArticleRepository['listPublic']> {
    return this.repository.listPublic({ ...query, featured: true }, normalizePagination(query));
  }

  search(query: ArticleSearchQuery): ReturnType<ArticleRepository['searchPublic']> {
    return this.repository.searchPublic(query.q.trim(), normalizePagination(query));
  }

  async get(idOrSlug: string): Promise<ArticleDetail> {
    const article = await this.repository.findPublicDetailByIdOrSlug(idOrSlug);

    if (!article) {
      throw AppError.notFound('Artigo não encontrado', 'ARTICLE_NOT_FOUND');
    }

    return article;
  }

  async create(input: CreateArticleInput): Promise<ArticleDetail> {
    await this.validateRelationships(input.categoryId, input.authorId);
    await this.validateSlug(input.slug);
    this.validatePublishedAt(input);

    return this.repository.create(input);
  }

  async update(id: string, input: UpdateArticleInput): Promise<ArticleDetail> {
    const current = await this.repository.findByIdRaw(id);

    if (!current) {
      throw AppError.notFound('Artigo não encontrado', 'ARTICLE_NOT_FOUND');
    }

    await this.validateRelationships(input.categoryId ?? current.categoryId, input.authorId ?? current.authorId);

    if (input.slug && input.slug !== current.slug) {
      await this.validateSlug(input.slug);
    }

    this.validatePublishedAt({
      status: input.status ?? current.status,
      publishedAt: input.publishedAt === undefined ? current.publishedAt : input.publishedAt
    });

    const updated = await this.repository.update(id, input);

    if (!updated) {
      throw AppError.notFound('Artigo não encontrado', 'ARTICLE_NOT_FOUND');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    const current = await this.repository.findByIdRaw(id);

    if (!current) {
      throw AppError.notFound('Artigo não encontrado', 'ARTICLE_NOT_FOUND');
    }

    await this.repository.softDelete(id);
  }

  private async validateRelationships(categoryId: string, authorId: string): Promise<void> {
    const category = await this.categoryRepository.findByIdOrSlug(categoryId);

    if (!category) {
      throw AppError.notFound('Categoria do artigo não encontrada', 'CATEGORY_NOT_FOUND');
    }

    const author = await this.authorRepository.findById(authorId);

    if (!author) {
      throw AppError.notFound('Autor do artigo não encontrado', 'AUTHOR_NOT_FOUND');
    }
  }

  private async validateSlug(slug: string): Promise<void> {
    const existing = await this.repository.findBySlug(slug);

    if (existing) {
      throw AppError.conflict('Slug de artigo já existe', 'SLUG_ALREADY_EXISTS');
    }
  }

  private validatePublishedAt(input: Pick<CreateArticleInput, 'status' | 'publishedAt'>): void {
    if (input.status === 'published' && !input.publishedAt) {
      throw AppError.badRequest('Artigos publicados exigem publishedAt', 'VALIDATION_ERROR');
    }
  }
}
