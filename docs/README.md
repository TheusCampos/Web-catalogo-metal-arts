# Documentação do Sistema — Catálogo Metal Arts

Bem-vindo ao centro de documentação técnica e de produto do **Catálogo Metal Arts — Marcenaria Fina & Móveis Nobres**.

Esta pasta contém o detalhamento completo da arquitetura técnica, modelo relacional de dados, decisões de engenharia, políticas de segurança e o Product Requirements Document (PRD) consolidado do projeto.

---

## 📚 Documentos Disponíveis

### 1. [Documentação Técnica do Sistema](./DOCUMENTACAO_SISTEMA.md)
Documento técnico voltado para desenvolvedores, arquitetos de software e engenheiros de infraestrutura/DevOps.
- **Conteúdo**: Arquitetura da aplicação (TanStack Start + SSR + Vite 8), integração com Supabase (PostgreSQL, Auth JWT, Storage, RLS e Server Functions com Service Role), estrutura de diretórios, pipeline de otimização de imagens WebP em alta definição (até 4K), injeção dinâmica de temas via CSS Variables, proteção CSRF e cabeçalhos de segurança (CSP/HSTS).

### 2. [PRD Completo (Product Requirements Document)](./PRD_COMPLETO.md)
Documento de produto voltado para Product Managers, lojistas, stakeholders e designers.
- **Conteúdo**: Visão geral do produto, personas, requisitos funcionais detalhados (experiência do consumidor e painel administrativo), requisitos não-funcionais, fluxos de usuário em diagramas Mermaid, esquema de banco de dados e roadmap de evolução.

---

## 🛠️ Visão Geral da Stack Tecnológica

| Camada | Tecnologia / Biblioteca | Versão / Destaque |
|---|---|---|
| **Framework Fullstack** | TanStack Start (React 19 + TypeScript + Vite 8 + Nitro) | v1.168+ (SSR Nativo) |
| **Roteamento & Cache** | TanStack Router + TanStack React Query v5 | Rotas tipadas e cache inteligente |
| **Backend & Banco de Dados** | Supabase (PostgreSQL 15+ com RLS + Auth + Storage) | PostgreSQL com 15 migrações |
| **Estilização & UI** | Tailwind CSS v4 + Radix UI + Lucide Icons + Sonner | Design System moderno e responsivo |
| **Formulários & Validação** | React Hook Form + Zod | Validação tipada de formulários e Server Functions |
| **Mídia & Imagens** | WebP Canvas Pipeline | Compressão client-side e cache de 1 ano (`immutable`) |
| **Estado Global** | Zustand | Carrinho e preferências locais com persistência |
