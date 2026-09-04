# 🪵 Catálogo Metal Arts — Marcenaria Fina & Design Nobre

Plataforma de **Catálogo Online e Gestão Comercial** de alta performance desenvolvida especificamente para a **Metal Arts** — especializada em móveis artesanais, marcenaria fina e peças nobres em madeira maciça com design sustentável.

O sistema combina uma experiência de compra moderna, leve e fluida para o cliente final (com fechamento de pedidos diretamente via WhatsApp) a um **Painel Administrativo completo** para controle de produtos, categorias, múltiplos formatos de banners, leads capturados e personalização de identidade visual da marca.

---

## 🚀 Tecnologias e Arquitetura

O projeto foi concebido com as tecnologias mais modernas do ecossistema React, priorizando **Server-Side Rendering (SSR)**, velocidade máxima de carregamento, segurança de dados e índice impecável no Google (Core Web Vitals):

| Camada | Tecnologia | Destaque / Propósito |
|---|---|---|
| **Framework Fullstack** | [TanStack Start](https://tanstack.com/start) (React 19 + Vite 8 + Nitro) | SSR nativo, Server Functions seguras e renderização ultrarrápida |
| **Roteamento Tipado** | [TanStack Router](https://tanstack.com/router) | Rotas tipadas com validação de search params e layout loaders |
| **Gerenciamento de Cache** | [TanStack Query v5](https://tanstack.com/query) | Cache resiliente, invalidação precisa pós-mutação e stale-while-revalidate |
| **Backend as a Service** | [Supabase](https://supabase.com) (PostgreSQL 15+) | Banco relacional com Row Level Security (RLS), Auth JWT e Storage de alta escala |
| **Estilização & Design** | [Tailwind CSS v4](https://tailwindcss.com) + [Radix UI](https://www.radix-ui.com/) | Design System sob medida, dark/light themes e componentes acessíveis |
| **Estado Global** | [Zustand](https://zustand-demo.pmnd.rs/) (com persistência) | Carrinho e preferências locais mantidos de forma leve |
| **Validação e Tipagem** | [Zod](https://zod.dev) + TypeScript Estrito | Sanitização de dados de entrada e tipos 100% sincronizados com o banco |
| **Mídia e Imagens** | WebP Canvas Pipeline | Compressão client-side de alta fidelidade (suporte até 4K) e cache de 1 ano |

---

## 📦 Funcionalidades do Sistema

### 🛍️ 1. Experiência do Cliente (Site Público)
- **Hero Carousel Responsivo:** Banners panorâmicos com suporte a imagem dedicada para mobile (`<picture>`), alternância automática e priorização de rede LCP (`fetchPriority="high"`).
- **Grid Promocional 4 Cards:** Grade em destaque para coleções especiais e campanhas com selos visuais refinados.
- **Vitrine de Madeiras Nobres:** Apresentação interativa de espécies nobres (Cumaru, Muiracatiara, Cedro Rosa, Peroba Rosa) com características e aplicações.
- **Banner Central Panorâmico & Editorial:** Destaque de grande impacto visual para projetos sob medida e storytelling da marcenaria artesanal.
- **Catálogo Completo (`/catalogo`):**
  - Busca textual em tempo real por nome e descrição;
  - Filtro instantâneo por categorias;
  - Paginação fluida sincronizada com a URL (`?pagina=X`);
  - Ordenação por novidades, menor preço e maior preço;
  - Banner específico para promoções do catálogo.
- **Página de Detalhes do Produto (`/produto/$id`):**
  - Galeria múltipla de fotos com pré-carregamento instantâneo no hover;
  - Especificações técnicas de marcenaria (tipo de madeira, dimensões, acabamento, peso, SKU);
  - Status de estoque e alerta de unidades restantes;
  - Seletor de cores e tamanhos;
  - Cálculo de parcelamento em até 12x configurável;
  - Recomendação de produtos relacionados da mesma categoria;
  - Compartilhamento nativo via Web Share API.
- **Carrinho & Checkout WhatsApp:**
  - Drawer deslizante acessível de qualquer página;
  - Ajuste dinâmico de quantidades com persistência no `localStorage`;
  - Formulário ágil com máscara de telefone brasileiro;
  - Registro de lead automático com sanitização Zod;
  - Redirecionamento instantâneo para o WhatsApp da loja com mensagem estruturada contendo itens, valores e dados do cliente.
- **Lista de Favoritos (`/favoritos`):** Salvamento local de produtos favoritos sem obrigar o cliente a criar conta ou senha.

---

### ⚙️ 2. Painel Administrativo (`/admin`)
- **Dashboard com Métricas em Tempo Real:** Total de produtos ativos, contagem de leads/pedidos no mês e status dos banners.
- **Gerenciador de Produtos:**
  - Cadastro e edição completa com upload de foto de capa e galeria múltipla;
  - Atributos avançados: Tipo de Madeira, Acabamento, Dimensões (AxLxP), Peso (kg), Estoque e SKU;
  - Flags de "Ativo" e "Destaque na Home".
- **Gerenciador de Categorias:** Criação, ordenação (`sort_order`) e upload de imagem de capa por categoria.
- **Gerenciador Multimodal de Banners:**
  - **Hero:** Slides principais com upload separado para Desktop e Mobile;
  - **Grid:** Mini-banners promocionais com seleção de posição de 1 a 4;
  - **Banner Central:** Destaque institucional de grande impacto;
  - **Banner Catálogo:** Imagem promocional no topo da listagem de produtos.
- **Gestão de Leads & Exportação CSV:** Tabela com todos os contatos capturados via checkout e newsletter com download em formato CSV para CRM.
- **Configurações da Loja:**
  - Nome da loja, logotipo e endereço físico;
  - WhatsApp oficial para recepção dos pedidos;
  - Links de redes sociais (Instagram e Facebook);
  - Seletor de cor primária com aplicação dinâmica instantânea via CSS Variables;
  - Número máximo de parcelas permitidas;
  - Customização editorial (seção Sobre, diferenciais e serviços).

---

## 🔒 Segurança e Prontidão para Produção

O projeto foi submetido a uma auditoria técnica profunda de prontidão para produção:

1. **Row Level Security (RLS) Blindado:**
   - Tabelas públicas possuem políticas de leitura restritas;
   - Operações de escrita admin são processadas exclusivamente via **Server Functions**, utilizando a chave de `service_role` protegida no backend;
   - Acesso público a leads foi totalmente removido do client-side.
2. **Proteção Anti-CSRF:** Validação de cabeçalhos e tokens através de middleware nativo no TanStack Start (`createCsrfMiddleware`).
3. **Security Headers Completos (`src/server.ts`):**
   - `Content-Security-Policy` (CSP) estrito;
   - `Strict-Transport-Security` (HSTS com `includeSubDomains`);
   - `X-Frame-Options: DENY` (anti-clickjacking);
   - `X-Content-Type-Options: nosniff`;
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
4. **Validação e Sanitização:** Todas as entradas de leads são validadas com Zod no servidor contra injeções ou valores corrompidos.
5. **Cache HTTP de 1 Ano para Mídia:** Imagens salvas no bucket com `cacheControl: "31536000, immutable"`, poupando transferência e consumo de banco.
6. **Robots.txt & SEO:** Áreas `/admin` e `/auth` protegidas contra crawlers, e meta tags dinâmicas OpenGraph/Twitter presentes em todas as rotas.
7. **Índices de Performance Criados:**
   - `idx_products_active` (`WHERE is_active = true`)
   - `idx_products_featured` (`WHERE is_featured = true`)
   - `idx_banners_active_sort` (`is_active, sort_order`)
   - `idx_categories_sort` (`sort_order`)

---

## 📁 Estrutura de Pastas

```text
catalogo-metal-arts-main/
├── docs/                        # Documentação Técnica detalhada e PRD
│   ├── README.md                # Sumário dos documentos
│   ├── DOCUMENTACAO_SISTEMA.md  # Arquitetura detalhada, fluxos e engenharia
│   └── PRD_COMPLETO.md          # Especificação de Requisitos de Produto (v2.0)
├── public/                      # Ativos estáticos públicos (logos, decor, robots.txt)
├── supabase/
│   └── migrations/              # 15 migrações SQL cronológicas estruturadas
├── src/
│   ├── components/
│   │   ├── admin/               # Componentes do painel (ImageField, GalleryField, etc.)
│   │   ├── catalog/             # Componentes da loja (Hero, Cards, Grids, Carrinho)
│   │   ├── decor/               # Ornamentos botânicos e artesanais SVG/Canvas
│   │   ├── layout/              # Header, Footer, Barras de avisos
│   │   └── ui/                  # Componentes base Shadcn / Radix
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts        # Cliente Supabase público para navegador
│   │       ├── client.server.ts # Cliente com service_role para Server Functions
│   │       ├── auth-middleware.ts # Guard de rotas protegidas
│   │       └── types.ts         # Tipos TypeScript 100% tipados do PostgreSQL
│   ├── lib/
│   │   ├── admin.functions.ts   # Server Functions para mutações administrativas
│   │   ├── store.functions.ts   # Server Functions para catálogo e captura de leads
│   │   ├── image.ts             # Pipeline de compressão WebP client-side
│   │   ├── cart.ts              # Store de carrinho (Zustand)
│   │   ├── favorites.ts         # Store de favoritos (Zustand)
│   │   └── whatsapp.ts          # Formatador de pedidos para a API do WhatsApp
│   ├── routes/                  # Rotas baseadas em arquivo (TanStack Router)
│   │   ├── __root.tsx           # Layout raiz com injeção de tema, fontes e metadata
│   │   ├── index.tsx            # Página inicial (Home)
│   │   ├── catalogo.tsx         # Catálogo completo com filtros
│   │   ├── produto.$id.tsx      # Página detalhada do produto
│   │   ├── favoritos.tsx        # Lista de desejos
│   │   ├── auth.tsx             # Login de administrador
│   │   └── _authenticated/      # Rotas protegidas (/admin)
│   ├── server.ts                # Servidor Nitro/SSR com headers de segurança
│   └── start.ts                 # Configuração do TanStack Start & CSRF
├── todas_migracoes.sql          # Script consolidado com todas as migrações SQL
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
# Usada apenas dentro das Server Functions para bypass do RLS
SUPABASE_SERVICE_ROLE_KEY="sua-service-role-key-aqui"
```

### 3. Banco de Dados e Migrações
Execute o conteúdo consolidado de `todas_migracoes.sql` no **SQL Editor** do painel do seu Supabase para criar todas as tabelas, funções, gatilhos, policies RLS e índices de performance.

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

Para detalhes técnicos aprofundados sobre arquitetura interna ou especificações de requisitos de produto, consulte os documentos na pasta [`docs/`](./docs/):
- **[`docs/DOCUMENTACAO_SISTEMA.md`](./docs/DOCUMENTACAO_SISTEMA.md)**: Manual técnico completo de engenharia, arquitetura e fluxos.
- **[`docs/PRD_COMPLETO.md`](./docs/PRD_COMPLETO.md)**: Product Requirements Document (PRD) com metas e roadmap.

---

**Metal Arts** — *A nobreza da marcenaria fina e o poder da tecnologia moderna.*
