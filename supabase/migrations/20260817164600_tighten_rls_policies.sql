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
