import { AppError } from '../../shared/errors/app-error';
import { AuthorRepository } from './author.repository';
import type { Author, CreateAuthorInput, UpdateAuthorInput } from './author.types';

export class AuthorService {
  constructor(private readonly repository: AuthorRepository) {}

  list(): Promise<Author[]> {
    return this.repository.list();
  }

  async get(id: string): Promise<Author> {
    const author = await this.repository.findById(id);

    if (!author) {
      throw AppError.notFound('Autor não encontrado', 'AUTHOR_NOT_FOUND');
    }

    return author;
  }

  create(input: CreateAuthorInput): Promise<Author> {
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateAuthorInput): Promise<Author> {
    await this.get(id);
    const updated = await this.repository.update(id, input);

    if (!updated) {
      throw AppError.notFound('Autor não encontrado', 'AUTHOR_NOT_FOUND');
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.get(id);

    if (await this.repository.hasActiveArticles(id)) {
      throw AppError.conflict('Autor possui artigos vinculados', 'AUTHOR_HAS_ARTICLES');
    }

    await this.repository.softDelete(id);
  }
}
