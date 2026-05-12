export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type Pagination = {
  page: number;
  pageSize: number;
  limit: number;
  offset: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

export const normalizePagination = (input: PaginationInput): Pagination => {
  const page = input.page && Number.isInteger(input.page) && input.page > 0 ? input.page : DEFAULT_PAGE;
  const requestedPageSize =
    input.pageSize && Number.isInteger(input.pageSize) && input.pageSize > 0 ? input.pageSize : DEFAULT_PAGE_SIZE;
  const pageSize = Math.min(requestedPageSize, MAX_PAGE_SIZE);

  return {
    page,
    pageSize,
    limit: pageSize,
    offset: (page - 1) * pageSize
  };
};

export const createPaginationMeta = (pagination: Pagination, total: number): PaginationMeta => {
  return {
    page: pagination.page,
    pageSize: pagination.pageSize,
    total,
    totalPages: Math.ceil(total / pagination.pageSize)
  };
};
