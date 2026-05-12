export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateCategoryInput = {
  name: string;
  slug: string;
  description: string;
  displayOrder?: number;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  display_order: number;
  created_at: Date;
  updated_at: Date;
};
