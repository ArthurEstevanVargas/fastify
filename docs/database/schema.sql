CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) > 0),
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text NOT NULL CHECK (length(trim(description)) > 0),
  display_order integer NOT NULL DEFAULT 0 CHECK (display_order >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE authors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (length(trim(name)) > 0),
  institution text,
  bio text,
  credentials text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  author_id uuid NOT NULL REFERENCES authors(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  title text NOT NULL CHECK (length(trim(title)) > 0),
  slug text NOT NULL CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  summary text NOT NULL CHECK (length(trim(summary)) > 0),
  content text NOT NULL CHECK (length(trim(content)) > 0),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('portuguese', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('portuguese', coalesce(content, '')), 'C')
  ) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT articles_published_at_required_chk
    CHECK (status <> 'published' OR published_at IS NOT NULL)
);

CREATE TABLE article_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES articles(id) ON UPDATE CASCADE ON DELETE CASCADE,
  title text NOT NULL CHECK (length(trim(title)) > 0),
  description text,
  url text CHECK (url IS NULL OR url ~ '^https?://'),
  source_order integer NOT NULL DEFAULT 0 CHECK (source_order >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE UNIQUE INDEX categories_slug_active_uidx ON categories (slug) WHERE deleted_at IS NULL;
CREATE INDEX categories_display_order_idx ON categories (display_order, name) WHERE deleted_at IS NULL;
CREATE INDEX authors_name_idx ON authors (name) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX articles_slug_active_uidx ON articles (slug) WHERE deleted_at IS NULL;
CREATE INDEX articles_category_id_idx ON articles (category_id) WHERE deleted_at IS NULL;
CREATE INDEX articles_author_id_idx ON articles (author_id) WHERE deleted_at IS NULL;
CREATE INDEX articles_public_list_idx ON articles (published_at DESC, created_at DESC)
  WHERE deleted_at IS NULL AND status = 'published';
CREATE INDEX articles_featured_idx ON articles (published_at DESC, created_at DESC)
  WHERE deleted_at IS NULL AND status = 'published' AND is_featured = true;
CREATE INDEX articles_search_vector_gin_idx ON articles USING gin (search_vector);
CREATE INDEX article_sources_article_id_idx ON article_sources (article_id, source_order)
  WHERE deleted_at IS NULL;
