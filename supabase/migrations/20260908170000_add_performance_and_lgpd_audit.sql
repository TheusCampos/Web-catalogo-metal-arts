-- ==============================================================================
-- Migração: Performance, LGPD Consentimento e Tabela de Auditoria (audit_logs)
-- Data: Setembro de 2026
-- ==============================================================================

-- 1. ÍNDICES DE PERFORMANCE PARA CATÁLOGO
-- Otimiza busca de produtos ativos com ordenação composta por sort_order e data
CREATE INDEX IF NOT EXISTS idx_products_active_sort_created
ON public.products (sort_order ASC, created_at DESC)
WHERE is_active = true;

-- Otimiza filtro por categoria com ordenação
CREATE INDEX IF NOT EXISTS idx_products_active_category_sort
ON public.products (category_id, sort_order ASC, created_at DESC)
WHERE is_active = true;

-- Otimiza busca textual por nome (usando trigram se disponível ou btree padrão)
CREATE INDEX IF NOT EXISTS idx_products_name_lower
ON public.products (lower(name));

-- 2. LGPD: CAMPOS DE CONSENTIMENTO EM customer_leads
ALTER TABLE public.customer_leads
ADD COLUMN IF NOT EXISTS marketing_consent boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS consent_at timestamptz,
ADD COLUMN IF NOT EXISTS privacy_version text DEFAULT 'v1.0';

CREATE INDEX IF NOT EXISTS idx_customer_leads_created
ON public.customer_leads (created_at DESC);

-- 3. TABELA DE AUDITORIA DO ADMIN: audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email text,
  action text NOT NULL, -- 'LOGIN', 'CREATE_PRODUCT', 'UPDATE_PRODUCT', 'DELETE_PRODUCT', 'EXPORT_LEADS', 'DELETE_LEAD', etc.
  resource text NOT NULL, -- 'products', 'categories', 'banners', 'leads', 'settings'
  resource_id text,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS para audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

-- Apenas admins autenticados podem ler os logs de auditoria
CREATE POLICY "audit_logs admin read" ON public.audit_logs
  FOR SELECT TO authenticated USING (true);

-- Admins autenticados podem inserir logs de ações realizadas
CREATE POLICY "audit_logs admin insert" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (true);

-- Índice para ordenação rápida do histórico de auditoria
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
ON public.audit_logs (created_at DESC);

-- 4. IDENTIDADE DA LOJA: CNPJ DA EMPRESA (OPCIONAL)
ALTER TABLE public.store_settings
ADD COLUMN IF NOT EXISTS cnpj text;
