-- Migração para documentar os campos adicionais de personalização no schema
-- (Utiliza a infraestrutura de store_settings existente)
ALTER TABLE public.store_settings
ADD COLUMN IF NOT EXISTS services_header jsonb,
ADD COLUMN IF NOT EXISTS services_items jsonb,
ADD COLUMN IF NOT EXISTS services_woods jsonb,
ADD COLUMN IF NOT EXISTS about_subtitle text,
ADD COLUMN IF NOT EXISTS about_badge_text text,
ADD COLUMN IF NOT EXISTS about_differentials jsonb;
