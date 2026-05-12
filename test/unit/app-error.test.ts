import { describe, expect, it } from 'vitest';
import { AppError } from '../../src/shared/errors/app-error';

describe('AppError', () => {
  it('creates not found errors with stable code and status', () => {
    const error = AppError.notFound('Artigo não encontrado', 'ARTICLE_NOT_FOUND');

    expect(error.message).toBe('Artigo não encontrado');
    expect(error.code).toBe('ARTICLE_NOT_FOUND');
    expect(error.statusCode).toBe(404);
  });

  it('creates conflict errors', () => {
    const error = AppError.conflict('Slug já existe', 'SLUG_ALREADY_EXISTS');

    expect(error.code).toBe('SLUG_ALREADY_EXISTS');
    expect(error.statusCode).toBe(409);
  });
});
