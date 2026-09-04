-- Arquivo: 20260807140932_e1d2b06e-2edc-43ff-b0bd-9fd2eedb3c5c.sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

-- store_settings
CREATE TABLE public.store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Minha Loja',
  logo_url text,
  primary_color text NOT NULL DEFAULT '#111827',
  whatsapp_number text NOT NULL DEFAULT '',
  instagram_url text,
  facebook_url text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.store_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.store_settings TO authenticated;
GRANT ALL ON public.store_settings TO service_role;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "store_settings public read" ON public.store_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "store_settings admin write" ON public.store_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_store_settings_updated BEFORE UPDATE ON public.store_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "categories admin write" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_categories_updated BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- banners
CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text,
  title text NOT NULL DEFAULT '',
  subtitle text,
  cta_text text,
  cta_link text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banners public read active" ON public.banners FOR SELECT TO anon USING (is_active);
CREATE POLICY "banners admin read" ON public.banners FOR SELECT TO authenticated USING (true);
CREATE POLICY "banners admin write" ON public.banners FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_banners_updated BEFORE UPDATE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- products
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  promo_price numeric(10,2),
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read active" ON public.products FOR SELECT TO anon USING (is_active);
CREATE POLICY "products admin read" ON public.products FOR SELECT TO authenticated USING (true);
CREATE POLICY "products admin write" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_products_category ON public.products(category_id);

-- customer_leads
CREATE TABLE public.customer_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  phone text,
  email text,
  product_interest uuid REFERENCES public.products(id) ON DELETE SET NULL,
  source text NOT NULL DEFAULT 'order',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.customer_leads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customer_leads TO authenticated;
GRANT ALL ON public.customer_leads TO service_role;
ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads public insert" ON public.customer_leads FOR INSERT TO anon, authenticated WITH CHECK (source IN ('order','newsletter'));
CREATE POLICY "leads admin read" ON public.customer_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "leads admin manage" ON public.customer_leads FOR DELETE TO authenticated USING (true);

INSERT INTO public.store_settings (name, primary_color, whatsapp_number, address)
VALUES ('Minha Loja', '#0f766e', '5511999999999', 'Rua Exemplo, 123 - São Paulo, SP');

-- Arquivo: 20260810135753_c401e3ef-553d-439f-a470-25680646a0ee.sql
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}'::text[];

-- Arquivo: 20260812211500_add_about_store.sql
ALTER TABLE public.store_settings
ADD COLUMN IF NOT EXISTS about_title text,
ADD COLUMN IF NOT EXISTS about_description text,
ADD COLUMN IF NOT EXISTS about_image_url text;


-- Arquivo: 20260812214500_add_category_image.sql
ALTER TABLE public.categories
ADD COLUMN IF NOT EXISTS image_url text;


-- Arquivo: 20260817164100_add_product_images_bucket.sql
-- Create a new storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the bucket
-- Allow public read access to all files
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING ( bucket_id = 'product-images' );

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'product-images' );

-- Allow authenticated users to update their files
CREATE POLICY "Authenticated users can update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( bucket_id = 'product-images' );

-- Allow authenticated users to delete their files
CREATE POLICY "Authenticated users can delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'product-images' );


-- Arquivo: 20260817164600_tighten_rls_policies.sql
-- Remover permissões de escrita diretas para clientes autenticados.
-- O painel administrativo agora usa Server Functions com a Service Role Key,
-- então não precisamos mais expor INSERT/UPDATE/DELETE no cliente.

-- store_settings
DROP POLICY IF EXISTS "store_settings admin write" ON public.store_settings;

-- categories
DROP POLICY IF EXISTS "categories admin write" ON public.categories;

-- banners
DROP POLICY IF EXISTS "banners admin write" ON public.banners;

-- products
DROP POLICY IF EXISTS "products admin write" ON public.products;

-- customer_leads
-- Para leads, o "leads public insert" continua valendo (é para anônimos e auth), 
-- mas a permissão de "leads admin manage" (DELETE) pode ser removida pois
-- agora a exclusão de leads é feita no server via supabaseAdmin.
DROP POLICY IF EXISTS "leads admin manage" ON public.customer_leads;


-- Arquivo: 20260817175000_add_max_installments.sql
ALTER TABLE public.store_settings ADD COLUMN max_installments INTEGER DEFAULT 0;


-- Arquivo: 20260817180000_add_missing_store_settings_fields.sql
ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS announcement_text text,
ADD COLUMN IF NOT EXISTS catalog_banner_url text,
ADD COLUMN IF NOT EXISTS trust_badge_1 text,
ADD COLUMN IF NOT EXISTS trust_badge_2 text,
ADD COLUMN IF NOT EXISTS trust_badge_3 text,
ADD COLUMN IF NOT EXISTS trust_badge_4 text;


-- Arquivo: 20260817181000_add_missing_products_fields.sql
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS stock_quantity integer,
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS sizes text[];


-- Arquivo: 20260818120000_add_colors_to_products.sql
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS colors text[];


-- Arquivo: 20260821000000_add_wood_furniture_fields.sql
-- Migration para adicionar campos específicos de peças e móveis de madeira
ALTER TABLE public.products
ADD COLUMN wood_type text,
ADD COLUMN dimensions text,
ADD COLUMN finish text,
ADD COLUMN weight_kg numeric(10,2);


-- Arquivo: 20260903150000_add_mobile_image_url_to_banners.sql
-- Migration para adicionar banner mobile opcional na tabela banners
ALTER TABLE public.banners
ADD COLUMN IF NOT EXISTS mobile_image_url text;


-- Arquivo: 20260904140000_add_services_and_editorial_fields.sql
-- Migração para documentar os campos adicionais de personalização no schema
ALTER TABLE public.store_settings
ADD COLUMN IF NOT EXISTS services_header jsonb,
ADD COLUMN IF NOT EXISTS services_items jsonb,
ADD COLUMN IF NOT EXISTS services_woods jsonb,
ADD COLUMN IF NOT EXISTS about_subtitle text,
ADD COLUMN IF NOT EXISTS about_badge_text text,
ADD COLUMN IF NOT EXISTS about_differentials jsonb;


-- Arquivo: 20260904160000_add_performance_indexes.sql
-- Índices de performance para queries do catálogo público
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_banners_active_sort ON public.banners(is_active, sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);

