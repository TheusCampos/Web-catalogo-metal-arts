ALTER TABLE public.store_settings
ADD COLUMN IF NOT EXISTS about_title text,
ADD COLUMN IF NOT EXISTS about_description text,
ADD COLUMN IF NOT EXISTS about_image_url text;
