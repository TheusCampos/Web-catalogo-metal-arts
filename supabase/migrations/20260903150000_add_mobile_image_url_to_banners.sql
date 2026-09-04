-- Adiciona o campo mobile_image_url na tabela banners para suporte a artes mobile dedicadas
ALTER TABLE public.banners ADD COLUMN IF NOT EXISTS mobile_image_url text;
