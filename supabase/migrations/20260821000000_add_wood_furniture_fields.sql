-- Migration para adicionar campos específicos de peças e móveis de madeira
ALTER TABLE public.products
ADD COLUMN wood_type text,
ADD COLUMN dimensions text,
ADD COLUMN finish text,
ADD COLUMN weight_kg numeric(10,2);
