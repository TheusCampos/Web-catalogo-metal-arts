-- Índices de performance para queries do catálogo público
-- Otimiza filtro de produtos ativos e ordenação por sort_order
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured) WHERE is_featured = true;

-- Otimiza filtro de banners ativos com ordenação
CREATE INDEX IF NOT EXISTS idx_banners_active_sort ON public.banners(is_active, sort_order) WHERE is_active = true;

-- Índice para ordenação de categorias
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);
