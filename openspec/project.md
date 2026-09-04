# Project Context: Catálogo Online (Loja Única)

> **Catálogo de Alta Performance com Checkout WhatsApp e Painel Admin White-Label**

## Overview

Plataforma e-commerce leve e otimizada voltada para catálogos digitais de alta conversão sem intermediários financeiros. Os clientes navegam, visualizam variações e fotos, montam sacolas e finalizam pedidos diretamente no WhatsApp da loja com dados pré-formatados e captura automática de leads no banco de dados.

## Tech Stack

| Layer             | Technology                                                             |
| ----------------- | ---------------------------------------------------------------------- |
| Framework         | TanStack Start (React 19 + Vite + Nitro SSR)                           |
| Routing           | TanStack Router (File-based routing em `src/routes/`)                  |
| Styling & UI      | Tailwind CSS v4, Lucide Icons, Radix UI Primitives                     |
| State Management  | Zustand (`cart.store.ts`, `favorites.store.ts`) & TanStack React Query |
| Database & BaaS   | Supabase (PostgreSQL, Row Level Security, Auth JWT)                    |
| Form & Validation | React Hook Form & Zod                                                  |
| Testing           | Vitest & React Testing Library                                         |

## Architecture

```
catalogo-metal-arts-main/
├── .agents/                 # Governança multi-agente, regras e skills especializadas
├── docs/                    # PRD detalhado e documentação arquitetural
├── openspec/                # Especificações técnicas e histórico de mudanças SDD
├── supabase/                # Migrações SQL e definições de banco de dados PostgreSQL
├── src/
│   ├── components/          # Componentes de UI, catálogo, layout e painel admin
│   ├── integrations/        # Clientes Supabase (Browser e SSR Server-Side)
│   ├── lib/                 # Funções auxiliares, server functions, formatters e cart
│   ├── routes/              # Rotas públicas e rotas protegidas (_authenticated/admin)
│   ├── stores/              # Zustand stores para carrinho e favoritos locais
│   └── styles.css           # Design tokens e estilos globais Tailwind v4
```

## Coding Conventions

### Naming

- Files: `kebab-case.ts`, `PascalCase.tsx` (componentes), `rota.slug.tsx` (TanStack Router)
- Componentes: `PascalCase`
- Server Functions: `createServerFn()` com validações estritas de schema e middleware de auth
- Feature IDs: `kebab-case`

### Error Handling

- Safe error boundaries com fallbacks visuais elegantes
- Retry resiliente em operações de escrita administrativa

### Quality Gates

Before any commit:

```bash
npm run format
npm run lint
npx tsc --noEmit
npx vitest run
npm run build
```

## Key Principles

1. **Zero Atrito no Checkout:** O cliente compra sem barreiras burocráticas; os pedidos chegam formatados no WhatsApp do lojista.
2. **SSR de Alta Performance:** Renderização rápida no servidor para pontuação máxima em Core Web Vitals e SEO com OpenGraph dinâmico.
3. **Segurança Rigorosa:** RLS ativo em todas as tabelas do PostgreSQL e validação JWT de administradores em todas as rotas e funções sensíveis.
