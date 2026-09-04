# Tasks: Finalização do Catálogo Metal Arts

- [x] **1. Ativação do Ecossistema Multi-Agente**
  - [x] Copiar `.agents`, `.cursorrules`, `.windsurfrules`, `.clinerules` e estrutura `openspec/` de `C:\Users\Suporte02\Desktop\AGENTES` para a raiz do repositório.
  - [x] Configurar `openspec/project.md` com o contexto real do projeto (TanStack Start + Supabase + Tailwind v4).

- [x] **2. Diagnóstico Inicial da Codebase (@codebase-scout)**
  - [x] Executar verificação de tipos (`tsc --noEmit`).
  - [x] Executar testes unitários com Vitest (`npx vitest run`).
  - [x] Executar e corrigir inconsistências de ESLint / Prettier (`npm run format`, `npm run lint`).
  - [x] Validar pipeline de build de produção (`npm run build`).

- [ ] **3. Refinamento de Código e Limpeza (@code-reviewer & @fullstack-specialist)**
  - [ ] Limpar imports e variáveis não utilizadas identificadas pelo linter em `src/routes/` e `src/components/`.
  - [ ] Otimizar hooks `useMemo` com dependências instáveis em `src/routes/_authenticated/admin/produtos.tsx`.

- [ ] **4. Expansão de Testes Automatizados (@qa-tester)**
  - [ ] Adicionar testes unitários para a store de carrinho (`src/stores/cart.store.ts`).
  - [ ] Adicionar testes unitários para a store de favoritos (`src/stores/favorites.store.ts`).

- [ ] **5. Auditoria de Segurança e RLS (@backend-specialist & @supabase)**
  - [ ] Auditar políticas RLS de `customer_leads`, `store_settings`, `products`, `categories` e `banners`.
  - [ ] Garantir que chamadas de API pública e administrativa usem instâncias e permissões adequadas.

- [ ] **6. Validação Visual e Experiência Mobile (@frontend-specialist & sub-browser-tester)**
  - [ ] Validar fluxo de navegação do cliente: Home -> Catálogo -> Produto -> Carrinho -> WhatsApp.
  - [ ] Validar painel administrativo: Login -> Produtos -> Banners -> Configurações de Marca.
