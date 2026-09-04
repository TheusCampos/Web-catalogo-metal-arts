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