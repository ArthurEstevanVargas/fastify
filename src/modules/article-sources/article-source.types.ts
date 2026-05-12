export type ArticleSource = {
  id: string;
  articleId: string;
  title: string;
  description: string | null;
  url: string | null;
  sourceOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateArticleSourceInput = {
  articleId: string;
  title: string;
  description?: string | null;
  url?: string | null;
  sourceOrder?: number;
};

export type UpdateArticleSourceInput = Partial<CreateArticleSourceInput>;

export type ArticleSourceRow = {
  id: string;
  article_id: string;
  title: string;
  description: string | null;
  url: string | null;
  source_order: number;
  created_at: Date;
  updated_at: Date;
};
