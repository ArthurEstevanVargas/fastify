export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'DATABASE_UNAVAILABLE'
  | 'INTERNAL_SERVER_ERROR'
  | 'CATEGORY_HAS_ARTICLES'
  | 'AUTHOR_HAS_ARTICLES'
  | 'CATEGORY_NOT_FOUND'
  | 'AUTHOR_NOT_FOUND'
  | 'ARTICLE_NOT_FOUND'
  | 'ARTICLE_SOURCE_NOT_FOUND'
  | 'ARTICLE_SOURCE_ARTICLE_NOT_FOUND'
  | 'SLUG_ALREADY_EXISTS';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;

  constructor(message: string, code: ErrorCode, statusCode: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }

  static badRequest(message = 'Requisição inválida', code: ErrorCode = 'VALIDATION_ERROR'): AppError {
    return new AppError(message, code, 400);
  }

  static notFound(message = 'Recurso não encontrado', code: ErrorCode = 'NOT_FOUND'): AppError {
    return new AppError(message, code, 404);
  }

  static conflict(message: string, code: ErrorCode = 'CONFLICT'): AppError {
    return new AppError(message, code, 409);
  }

  static serviceUnavailable(message = 'Banco de dados indisponível'): AppError {
    return new AppError(message, 'DATABASE_UNAVAILABLE', 503);
  }
}
