ALTER TABLE public.store_settings 
ADD COLUMN IF NOT EXISTS announcement_text text,
ADD COLUMN IF NOT EXISTS catalog_banner_url text,
ADD COLUMN IF NOT EXISTS trust_badge_1 text,
ADD COLUMN IF NOT EXISTS trust_badge_2 text,
ADD COLUMN IF NOT EXISTS trust_badge_3 text,
ADD COLUMN IF NOT EXISTS trust_badge_4 text;
