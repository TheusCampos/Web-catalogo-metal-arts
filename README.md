# 🪵 Catálogo Metal Arts — Marcenaria Fina & Design Nobre

Plataforma de **Catálogo Online e Gestão Comercial** de alta performance desenvolvida especificamente para a **Metal Arts** — especializada em móveis artesanais, marcenaria fina e peças nobres em madeira maciça com design sustentável.

O sistema combina uma experiência de compra moderna, leve e fluida para o cliente final (com fechamento de pedidos diretamente via WhatsApp e conformidade total com a LGPD) a um **Painel Administrativo completo** para controle de produtos, categorias, múltiplos formatos de banners, leads capturados, trilhas de auditoria, personalização de identidade visual e dados fiscais da marca (CNPJ).

---

## 🚀 Tecnologias e Arquitetura

O projeto foi concebido com as tecnologias mais modernas do ecossistema React, priorizando **Server-Side Rendering (SSR)**, velocidade máxima de carregamento, segurança de dados e índice impecável no Google (Core Web Vitals):

| Camada                     | Tecnologia                                                                         | Destaque / Propósito                                                           |
| -------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Framework Fullstack**    | [TanStack Start](https://tanstack.com/start) (React 19 + Vite 8 + Nitro)           | SSR nativo, Server Functions seguras e renderização ultrarrápida               |
| **Roteamento Tipado**      | [TanStack Router](https://tanstack.com/router)                                     | Rotas tipadas com validação de search params e layout loaders                  |
| **Gerenciamento de Cache** | [TanStack Query v5](https://tanstack.com/query)                                    | Cache resiliente, paginação real via PostgreSQL `range` e invalidação seletiva |
| **Backend as a Service**   | [Supabase](https://supabase.com) (PostgreSQL 15+)                                  | Banco relacional com RLS, Auth JWT, Storage com transformações e auditoria     |
| **Privacidade & LGPD**     | Módulo Nativo (`src/features/privacy/`)                                            | Cookie Banner, preferências granulares versionadas e canal oficial de direitos |
| **Estilização & Design**   | [Tailwind CSS v4](https://tailwindcss.com) + [Radix UI](https://www.radix-ui.com/) | Design System sob medida, dark/light themes e componentes acessíveis           |
| **Estado Global**          | [Zustand](https://zustand-demo.pmnd.rs/) (com persistência)                        | Carrinho e preferências locais mantidos de forma leve                          |
| **Validação e Tipagem**    | [Zod](https://zod.dev) + TypeScript Estrito                                        | Sanitização de dados de entrada e tipos 100% sincronizados com o banco         |
| **Mídia e Imagens**        | WebP Pipeline + Supabase Storage Transformations                                   | Imagens responsivas (`srcset`), WebP em alta definição e cache imutável        |

---

## 📦 Funcionalidades do Sistema

### 🛍️ 1. Experiência do Cliente (Site Público)

- **Hero Carousel Responsivo:** Banners panorâmicos com suporte a imagem dedicada para mobile (`<picture>`), alternância automática e priorização de rede LCP (`fetchPriority="high"`).
- **Grid Promocional 4 Cards:** Grade em destaque para coleções especiais e campanhas com selos visuais refinados.
- **Vitrine de Madeiras Nobres:** Apresentação interativa de espécies nobres (Cumaru, Muiracatiara, Cedro Rosa, Peroba Rosa) com características e aplicações.
- **Banner Central Panorâmico & Editorial:** Destaque de grande impacto visual para projetos sob medida e storytelling da marcenaria artesanal.
- **Catálogo Completo Paginado no Banco (`/catalogo`):**
  - Busca textual em tempo real por nome;
  - Filtro instantâneo por categorias;
  - **Paginação real no PostgreSQL** via `range()` sincronizada com a URL (`?pagina=X`), escalável para centenas de produtos sem lentidão;
  - Cards memoizados com `srcset` responsivo e priorização dos primeiros itens da dobra.
- **Página de Detalhes do Produto (`/produto/$id`):**
  - Carregamento sob demanda **exclusivo do produto requisitado** (sem baixar todo o catálogo);
  - Galeria múltipla de fotos com pré-carregamento instantâneo no hover;
  - Especificações técnicas de marcenaria (tipo de madeira, dimensões, acabamento, peso, SKU);
  - Status de estoque e alerta de unidades restantes;
  - Seletor de cores e tamanhos e cálculo de parcelamento em até 12x configurável.
- **Carrinho & Checkout WhatsApp com Consentimento LGPD:**
  - Drawer deslizante acessível de qualquer página;
  - Formulário ágil com máscara de telefone brasileiro;
  - **Checkbox opcional e desmarcado de consentimento de marketing** (conforme LGPD);
  - Registro de lead automático com sanitização Zod, timestamp e versão dos termos;
  - Redirecionamento instantâneo para o WhatsApp da loja com mensagem estruturada contendo itens, valores e dados do cliente.
- **Governança de Privacidade & Cookies:**
  - `CookieBanner` e modal granular de preferências (_Necessários_, _Analíticos_, _Marketing_);
  - Disparo condicional de tags de terceiros;
  - Páginas institucionais `/privacidade`, `/cookies` e canal do titular `/direitos-titular` com protocolo automático (`MA-YYYYMMDD-XXXX`).
- **Lista de Favoritos (`/favoritos`):** Salvamento local de produtos favoritos no `localStorage`.

---

### ⚙️ 2. Painel Administrativo (`/admin`)

- **Dashboard com Métricas em Tempo Real:** Total de produtos ativos, contagem de leads/pedidos no mês e status dos banners.
- **Gerenciador de Produtos:** Cadastro e edição completa com galeria múltipla, atributos técnicos e upload de fotos com compressão WebP.
- **Gerenciador de Categorias:** Criação, ordenação (`sort_order`) e upload de imagem de capa por categoria.
- **Gerenciador Multimodal de Banners:** Hero (Desktop e Mobile), Grid promocional, Banner Central e Banner Catálogo.
- **Gestão de Leads & Exportação CSV Segura:** Tabela com histórico de contatos, indicador visual de consentimento de marketing e exportação sanitizada contra fórmulas maliciosas (com registro automático de auditoria).
- **Trilha de Auditoria Administrativa (`/admin/auditoria`):** Histórico visual completo de ações administrativas sensíveis no sistema.
- **Configurações da Loja & Identidade Fiscal:**
  - Nome da loja, logotipo e endereço físico;
  - **CNPJ da Empresa (Opcional):** Campo dedicado no cadastro da loja, persistido no banco e exibido automaticamente no rodapé do site para atendimento ao Decreto 7.962/2013;
  - WhatsApp oficial para recepção dos pedidos;
  - Links de redes sociais (Instagram e Facebook);
  - Seletor de cor primária com aplicação dinâmica instantânea via CSS Variables;
  - Número máximo de parcelas permitidas e customização editorial.

---

## 🔒 Segurança e Prontidão para Produção

O projeto conta com uma esteira de segurança e conformidade em conformidade com as diretrizes OWASP e LGPD:

1. **Row Level Security (RLS) Rigoroso:** Leituras públicas restritas e escritas administrativas permitidas apenas via Server Functions autenticadas.
2. **Trilhas de Auditoria (`audit_logs`):** Registro forense de operações críticas do lojista (atualização de configurações, produtos, exportação de leads).
3. **Sanitização de CSV e Validação Zod:** Proteção contra ataques de injeção de fórmulas no Excel (`=`, `+`, `-`, `@`) e sanitização de inputs de leads.
4. **Proteção Anti-CSRF & Security Headers:** Validação nativa com `createCsrfMiddleware` e headers HTTP estritos (`CSP`, `HSTS`, `X-Frame-Options: DENY`, `nosniff`).
5. **Cache HTTP de 1 Ano para Mídia:** Imagens salvas com `cacheControl: "31536000, immutable"`.
6. **Índices de Performance Otimizados:**
   - `idx_products_active_sort_created` (`sort_order ASC, created_at DESC WHERE is_active = true`)
   - `idx_products_active_category_sort` (`category_id, sort_order ASC, created_at DESC WHERE is_active = true`)
   - `idx_products_name_lower` (`lower(name)`)
   - `idx_customer_leads_created` (`created_at DESC`)
   - `idx_audit_logs_created_at` (`created_at DESC`)

---

## 📁 Estrutura de Pastas

```text
catalogo-metal-arts-main/
├── docs/                        # Documentação Técnica, PRD e Governança LGPD
│   ├── README.md                # Sumário dos documentos
│   ├── DOCUMENTACAO_SISTEMA.md  # Arquitetura detalhada, fluxos e engenharia (v2.1)
│   ├── PRD_COMPLETO.md          # Especificação de Requisitos de Produto (v2.1)
│   ├── lgpd-mapa-de-dados.md    # Inventário e bases legais de dados pessoais
│   └── politica-retencao-dados.md # Políticas de ciclo de vida e expurgo de dados
├── public/                      # Ativos estáticos públicos (logos, sitemap.xml, robots.txt)
├── supabase/
│   └── migrations/              # 16 migrações SQL cronológicas estruturadas
├── src/
│   ├── components/              # Componentes de UI, layout, catálogo e admin
│   ├── features/
│   │   └── privacy/             # Feature de Cookie Consent e Governança LGPD
│   ├── integrations/
│   │   └── supabase/            # Clientes anon e service_role, middlewares e types
│   ├── lib/                     # Server functions, queries, imagem, telefone e carrinho
│   ├── routes/                  # Rotas públicas, institucionais e administrativas
│   ├── server.ts                # Servidor Nitro com security headers
│   └── start.ts                 # Configuração do TanStack Start & CSRF
├── todas_migracoes.sql          # Script consolidado com todo o histórico SQL
└── package.json
```

---

## 🛠️ Instalação e Execução Local

### Pré-requisitos

- **Node.js:** `v20.x` ou superior (recomendado `v22.x`)
- **NPM:** `v10.x` ou superior
- Projeto ativo no **[Supabase](https://supabase.com)** com PostgreSQL e Storage habilitados.

### 1. Clonar o repositório e instalar dependências

```bash
git clone <url-do-repositorio>
cd catalogo-metal-arts-main
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
# Chave pública (usada pelo navegador e SSR para leituras públicas)
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sua-anon-key-aqui"

# Necessárias no servidor para execução do SSR
SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_PUBLISHABLE_KEY="sua-anon-key-aqui"

# Chave privada de administrador (NUNCA incluir VITE_ na frente)
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key-aqui"
```

### 3. Banco de Dados e Migrações

Execute o script `supabase/migrations/20260908170000_add_performance_and_lgpd_audit.sql` (ou `todas_migracoes.sql`) no **SQL Editor** do painel do seu Supabase.

Certifique-se de que o bucket `product-images` foi criado no Supabase Storage como **Público**.

### 4. Executar em modo de desenvolvimento

```bash
npm run dev
```

O aplicativo iniciará em `http://localhost:8080`.

---

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor local de desenvolvimento com Hot Module Replacement (HMR).
- `npm run build`: Compila a aplicação para produção (SSR + client bundles otimizados).
- `npm run preview`: Executa localmente o bundle de produção compilado.
- `npm run lint`: Analisa o código com ESLint para garantir os padrões de qualidade.
- `npm run format`: Formata todo o código com Prettier.

---

## 📚 Documentação Adicional

Para detalhes técnicos e de conformidade, consulte os guias em [`docs/`](./docs/):

- **[`docs/DOCUMENTACAO_SISTEMA.md`](./docs/DOCUMENTACAO_SISTEMA.md)**: Manual técnico completo de engenharia, arquitetura e fluxos (v2.1).
- **[`docs/PRD_COMPLETO.md`](./docs/PRD_COMPLETO.md)**: Product Requirements Document (PRD v2.1).
- **[`docs/lgpd-mapa-de-dados.md`](./docs/lgpd-mapa-de-dados.md)**: Mapa de ciclo de vida de dados pessoais e bases legais LGPD.
- **[`docs/politica-retencao-dados.md`](./docs/politica-retencao-dados.md)**: Políticas de retenção e procedimento para expurgo de dados.

---

**Metal Arts** — _A nobreza da marcenaria fina e o poder da tecnologia moderna._
