ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS stock_quantity integer,
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS sizes text[];
