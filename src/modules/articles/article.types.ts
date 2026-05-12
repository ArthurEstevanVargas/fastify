import type { ArticleSource } from '../article-sources/article-source.types';

export const ARTICLE_STATUSES = ['draft', 'published', 'archived'] as const;
export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];

export type Article = {
  id: string;
  categoryId: string;
  authorId: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: ArticleStatus;
  isFeatured: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ArticleListItem = Omit<Article, 'content' | 'categoryId' | 'authorId' | 'createdAt' | 'updatedAt'> & {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
  };
};

export type ArticleDetail = Article & {
  category: {
    id: string;
    name: string;
    slug: string;
  };
  author: {
    id: string;
    name: string;
    institution: string | null;
    credentials: string | null;
  };
  sources: ArticleSource[];
};

export type ArticleListQuery = {
  page?: number;
  pageSize?: number;
  categoryId?: string;
  categorySlug?: string;
  authorId?: string;
  status?: ArticleStatus;
  featured?: boolean;
};

export type ArticleSearchQuery = {
  q: string;
  page?: number;
  pageSize?: number;
};

export type CreateArticleInput = {
  categoryId: string;
  authorId: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status?: ArticleStatus;
  isFeatured?: boolean;
  publishedAt?: string | null;
};

export type UpdateArticleInput = Partial<CreateArticleInput>;

export type ArticleRow = {
  id: string;
  category_id: string;
  author_id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: ArticleStatus;
  is_featured: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export type ArticleListRow = Omit<ArticleRow, 'content' | 'category_id' | 'author_id' | 'created_at' | 'updated_at'> & {
  category_id: string;
  category_name: string;
  category_slug: string;
  author_id: string;
  author_name: string;
  total_count: string;
};

export type ArticleDetailRow = ArticleRow & {
  category_name: string;
  category_slug: string;
  author_name: string;
  author_institution: string | null;
  author_credentials: string | null;
};
