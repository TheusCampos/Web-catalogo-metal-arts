# Documentação do Sistema — Catálogo Metal Arts

Bem-vindo ao centro de documentação técnica, produto e governança do **Catálogo Metal Arts — Marcenaria Fina & Móveis Nobres**.

Esta pasta contém o detalhamento completo da arquitetura técnica, modelo relacional de dados, decisões de engenharia, esteira de conformidade com a LGPD e o Product Requirements Document (PRD) consolidado do projeto.

---

## 📚 Documentos Disponíveis

### 1. [Documentação Técnica do Sistema (v2.1)](./DOCUMENTACAO_SISTEMA.md)

Documento técnico voltado para desenvolvedores, arquitetos de software e engenheiros de infraestrutura/DevOps.

- **Conteúdo**: Arquitetura da aplicação (TanStack Start + SSR + Vite 8), integração Supabase (PostgreSQL 15+, Auth JWT, Storage com transformação dinâmica, RLS e Server Functions com Service Role), estrutura de diretórios, pipeline de imagens com `srcset` responsivo, paginação real no banco com `range()`, conformidade LGPD, trilha de auditoria `audit_logs` e campo opcional de CNPJ da empresa.

### 2. [PRD Completo — Product Requirements Document (v2.1)](./PRD_COMPLETO.md)

Documento de produto voltado para Product Managers, lojistas, stakeholders e designers.

- **Conteúdo**: Visão geral do produto, personas, requisitos funcionais detalhados (experiência do consumidor, checkout WhatsApp com consentimento de ofertas e painel administrativo), requisitos não-funcionais, fluxos de compra em diagramas Mermaid, esquema de banco de dados e roadmap de evolução.

### 3. [Mapa de Ciclo de Vida de Dados — LGPD](./lgpd-mapa-de-dados.md)

Mapeamento formal de conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).

- **Conteúdo**: Inventário de dados pessoais coletados (leads, cookies e logs), finalidades de tratamento, bases legais aplicadas (Arts. 7º e 11) e medidas de segurança técnicas e administrativas.

### 4. [Política de Retenção e Expurgo de Dados](./politica-retencao-dados.md)

Manual operacional de ciclo de vida e descarte seguro de informações pessoais.

- **Conteúdo**: Prazos de retenção de contatos comerciais e logs de auditoria, critérios de expurgo e procedimento para acionamento da rotina `purgeOldLeads`.

---

## 🛠️ Visão Geral da Stack Tecnológica

| Camada                       | Tecnologia / Biblioteca                                 | Versão / Destaque                                          |
| ---------------------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| **Framework Fullstack**      | TanStack Start (React 19 + TypeScript + Vite 8 + Nitro) | v1.168+ (SSR Nativo e Server Functions seguras)            |
| **Roteamento & Cache**       | TanStack Router + TanStack React Query v5               | Rotas tipadas e paginação eficiente via PostgreSQL `range` |
| **Backend & Banco de Dados** | Supabase (PostgreSQL 15+ com RLS + Auth + Storage)      | PostgreSQL com 16 migrações, índices e auditoria           |
| **Governança & LGPD**        | Módulo de Privacidade Nativo + Cookie Banner            | Consentimento granular versionado e canal de direitos      |
| **Estilização & UI**         | Tailwind CSS v4 + Radix UI + Lucide Icons + Sonner      | Design System moderno, responsivo e temático               |
| **Formulários & Validação**  | React Hook Form + Zod                                   | Validação tipada com sanitização em formulários e leads    |
| **Mídia & Imagens**          | WebP Pipeline + Supabase Storage Transformations        | Imagens responsivas (`srcset`), WebP e cache imutável      |
| **Estado Global**            | Zustand                                                 | Carrinho e preferências locais com persistência            |
