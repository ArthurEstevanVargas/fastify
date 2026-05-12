import { describe, expect, it } from 'vitest';
import { createPaginationMeta, normalizePagination } from '../../src/shared/pagination/pagination';

describe('pagination utilities', () => {
  it('uses defaults for missing values', () => {
    const pagination = normalizePagination({});

    expect(pagination).toEqual({
      page: 1,
      pageSize: 20,
      limit: 20,
      offset: 0
    });
  });

  it('caps page size and calculates offset', () => {
    const pagination = normalizePagination({ page: 3, pageSize: 200 });

    expect(pagination.pageSize).toBe(100);
    expect(pagination.limit).toBe(100);
    expect(pagination.offset).toBe(200);
  });

  it('creates response metadata', () => {
    const pagination = normalizePagination({ page: 2, pageSize: 10 });

    expect(createPaginationMeta(pagination, 25)).toEqual({
      page: 2,
      pageSize: 10,
      total: 25,
      totalPages: 3
    });
  });
});
