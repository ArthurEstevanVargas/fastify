import { AppError } from '../../shared/errors/app-error';
import type { Database } from '../../types/database';
import { ArticleRepository } from '../articles/article.repository';
import { ArticleSourceRepository } from './article-source.repository';
import type { ArticleSource, CreateArticleSourceInput, UpdateArticleSourceInput } from './article-source.types';

export class ArticleSourceService {
  private readonly articleRepository: ArticleRepository;

  constructor(
    private readonly repository: ArticleSourceRepository,
    db: Database
  ) {
    this.articleRepository = new ArticleRepository(db);
  }

  list(articleId?: string): Promise<ArticleSource[]> {
    return this.repository.list(articleId);
  }

  async get(id: string): Promise<ArticleSource> {
    const source = await this.repository.findById(id);

    if (!source) {
      throw AppError.notFound('Fonte não encontrada', 'ARTICLE_SOURCE_NOT_FOUND');
    }

    return source;
  }

  async create(input: CreateArticleSourceInput): Promise<ArticleSource> {
    await this.ensureArticleExists(input.articleId);
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateArticleSourceInput): Promise<ArticleSource> {
    await this.get(id);

    if (input.articleId) {
      await this.ensureArticleExists(input.articleId);
    }

    const updated = await this.repository.update(id, input);

    if (!updated) {
      throw AppError.notFound('Fonte não encontrada', 'ARTICLE_SOURCE_NOT_FOUND');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.get(id);
    await this.repository.softDelete(id);
  }

  private async ensureArticleExists(articleId: string): Promise<void> {
    const article = await this.articleRepository.findByIdRaw(articleId);

    if (!article) {
      throw AppError.notFound('Artigo da fonte não encontrado', 'ARTICLE_SOURCE_ARTICLE_NOT_FOUND');
    }
  }
}
