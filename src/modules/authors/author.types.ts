export type Author = {
  id: string;
  name: string;
  institution: string | null;
  bio: string | null;
  credentials: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateAuthorInput = {
  name: string;
  institution?: string | null;
  bio?: string | null;
  credentials?: string | null;
};

export type UpdateAuthorInput = Partial<CreateAuthorInput>;

export type AuthorRow = {
  id: string;
  name: string;
  institution: string | null;
  bio: string | null;
  credentials: string | null;
  created_at: Date;
  updated_at: Date;
};
