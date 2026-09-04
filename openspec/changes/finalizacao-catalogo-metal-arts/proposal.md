# Change Proposal: Finalização e Consolidação Multi-Agente do Catálogo Metal Arts

## Why

Integrar e ativar o ecossistema de governança multi-agente (`.agents`) originado em `C:\Users\Suporte02\Desktop\AGENTES` no projeto `catalogo-metal-arts-main` para orquestrar a auditoria, refinamento e finalização completa do sistema de catálogo com checkout WhatsApp, SSR em TanStack Start e painel administrativo Supabase.

## What Changes

1. **Governança Multi-Agente & OpenSpec Ativos:**
   - Sincronização completa de `.agents/` (regras, skills especializadas de 10 agentes e sub-agentes).
   - Configuração do contexto do projeto em `openspec/project.md` e regras de IDE (`.cursorrules`, `.windsurfrules`, `.clinerules`).
2. **Auditoria de Qualidade e Código (Code Reviewer & QA Tester):**
   - Resolução de inconsistências de formatação (Prettier), tipagem e linting (ESLint 0 erros).
   - Verificação de cobertura de testes unitários em `vitest` e validação do pipeline de build SSR Nitro.
3. **Refinamento de Frontend e UX (Frontend Specialist):**
   - Revisão e polimento dos fluxos de catálogo, página de detalhes do produto, galeria interativa de fotos e gaveta de carrinho (CartSheet).
   - Validação de contraste de tema dinâmico e responsividade mobile-first.
4. **Segurança e Backend (Backend Specialist):**
   - Conferência de integridade das migrações SQL, esquemas de tabelas e políticas de Row Level Security (RLS) no Supabase.

## Impact

- Projeto 100% padronizado sob o framework de agentes autônomos.
- Build, testes e linting em estado estritamente verde.
- Roteamento claro de tarefas através do Task Dispatch Contract (TDC).
