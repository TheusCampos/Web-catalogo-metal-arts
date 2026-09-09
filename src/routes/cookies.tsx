import { createFileRoute, Link } from "@tanstack/react-router";
import { Cookie, Settings, ShieldCheck, ChevronRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConsent } from "@/features/privacy/hooks/useConsent";
import { CookiePreferencesModal } from "@/features/privacy/components/CookiePreferencesModal";
import type { CookieInfo } from "@/features/privacy/types/consent.types";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Política de Cookies — Serralheria Metal Arts" },
      {
        name: "description",
        content:
          "Conheça todos os cookies e tecnologias de armazenamento local utilizadas pelo Catálogo Metal Arts para garantir velocidade, segurança e preferências.",
      },
      { property: "og:title", content: "Política de Cookies — Serralheria Metal Arts" },
      {
        property: "og:description",
        content:
          "Tabela detalhada de cookies, fornecedores, finalidades e ferramenta de gestão de consentimento.",
      },
      { property: "og:url", content: "https://www.serralheriametalarts.com.br/cookies" },
    ],
    links: [{ rel: "canonical", href: "https://www.serralheriametalarts.com.br/cookies" }],
  }),
  component: CookiesPolicyPage,
});

const COOKIES_LIST: CookieInfo[] = [
  {
    name: "metal_arts_cookie_consent_v1",
    category: "necessary",
    purpose: "Armazena a escolha de consentimento de cookies realizada pelo usuário.",
    vendor: "Serralheria Metal Arts (localStorage)",
    duration: "12 meses",
  },
  {
    name: "metal_arts_cart",
    category: "necessary",
    purpose: "Preserva os itens adicionados ao carrinho de orçamento durante a navegação.",
    vendor: "Serralheria Metal Arts (localStorage)",
    duration: "Persistente no navegador",
  },
  {
    name: "metal_arts_favorites",
    category: "necessary",
    purpose: "Guarda a lista de produtos favoritados pelo visitante no dispositivo local.",
    vendor: "Serralheria Metal Arts (localStorage)",
    duration: "Persistente no navegador",
  },
  {
    name: "sb-auth-token",
    category: "necessary",
    purpose: "Sessão segura de autenticação para o lojista e administradores do painel.",
    vendor: "Supabase",
    duration: "Sessão ativa",
  },
  {
    name: "_ga, _gid (Google Analytics)",
    category: "analytics",
    purpose:
      "Métricas de páginas visitadas, tempo de permanência e taxa de conversão (somente sob consentimento).",
    vendor: "Google LLC",
    duration: "Até 14 meses",
  },
  {
    name: "_fbp (Meta Pixel)",
    category: "marketing",
    purpose:
      "Mensuração de anúncios no Instagram e Facebook sobre móveis visualizados (somente sob consentimento).",
    vendor: "Meta Platforms",
    duration: "90 dias",
  },
];

function CookiesPolicyPage() {
  const { preferences, isModalOpen, setIsModalOpen, saveCustom } = useConsent();

  return (
    <div className="container-page pt-24 pb-16 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground transition-colors">
          Página Inicial
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-bold text-foreground">Política de Cookies</span>
      </nav>

      {/* Header */}
      <header className="space-y-3 pb-8 border-b border-border/60">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <Cookie className="h-3.5 w-3.5" /> Gestão e Transparência
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Política de Cookies e Tecnologias de Armazenamento
        </h1>
        <p className="text-sm text-muted-foreground">
          Transparência total sobre as tecnologias utilizadas para entregar um catálogo rápido e
          seguro.
        </p>
      </header>

      <div className="mt-8 space-y-10 text-foreground/90 text-sm sm:text-base leading-relaxed">
        {/* Painel de Ação Rápida */}
        <section className="p-6 rounded-2xl border border-primary/30 bg-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-bold text-base text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Suas Preferências Atuais
            </h2>
            <p className="text-xs text-muted-foreground">
              Você pode alterar ou revogar seu consentimento a qualquer instante.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs font-medium">
              <span className="px-2 py-0.5 rounded bg-muted">
                Necessários: <strong>Ativos</strong>
              </span>
              <span
                className={`px-2 py-0.5 rounded ${preferences.analytics ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}
              >
                Analytics: <strong>{preferences.analytics ? "Autorizado" : "Recusado"}</strong>
              </span>
              <span
                className={`px-2 py-0.5 rounded ${preferences.marketing ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}
              >
                Marketing: <strong>{preferences.marketing ? "Autorizado" : "Recusado"}</strong>
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="gap-2 shrink-0 font-bold cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            Configurar Cookies
          </Button>
        </section>

        {/* O que são cookies */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">
            1. O que são cookies e armazenamento local?
          </h2>
          <p>
            Cookies e <em>Web Storage</em> (como{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">localStorage</code>) são
            pequenos arquivos ou fragmentos de dados armazenados no navegador do seu dispositivo
            móvel ou computador. Eles servem para lembrar suas preferências (como itens salvos no
            carrinho ou modo escuro) e viabilizar funcionalidades essenciais do comércio eletrônico
            sem a necessidade de criar contas ou efetuar cadastros antecipados.
          </p>
        </section>

        {/* Tabela de Cookies */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            2. Tabela Detalhada de Cookies Utilizados
          </h2>
          <p className="text-sm text-muted-foreground">
            Abaixo estão discriminados todos os identificadores, categorias, finalidades e prazos de
            expiração utilizados em nossa plataforma:
          </p>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-muted/50 border-b border-border text-foreground font-bold">
                <tr>
                  <th className="p-3">Nome / Identificador</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Finalidade</th>
                  <th className="p-3">Fornecedor</th>
                  <th className="p-3">Duração</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COOKIES_LIST.map((c) => (
                  <tr key={c.name} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono text-xs font-semibold text-foreground">
                      {c.name}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                          c.category === "necessary"
                            ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                            : c.category === "analytics"
                              ? "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300"
                              : "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        {c.category === "necessary"
                          ? "Necessário"
                          : c.category === "analytics"
                            ? "Analytics"
                            : "Marketing"}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{c.purpose}</td>
                    <td className="p-3 text-muted-foreground">{c.vendor}</td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">{c.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Como desativar no navegador */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground">
            3. Como gerenciar cookies pelo seu navegador
          </h2>
          <p>
            Além do nosso painel interativo de preferências, você pode a qualquer momento bloquear
            ou apagar cookies diretamente nas configurações de privacidade do seu navegador de
            internet (Google Chrome, Mozilla Firefox, Safari, Microsoft Edge). Note que o bloqueio
            de cookies necessários poderá afetar o funcionamento do carrinho de compras e navegação
            do catálogo.
          </p>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/40 text-xs text-muted-foreground">
            <Info className="h-4 w-4 shrink-0" />
            <span>
              Dúvidas sobre o tratamento de dados? Acesse nossa{" "}
              <Link to="/privacidade" className="underline font-medium text-foreground">
                Política de Privacidade
              </Link>{" "}
              ou solicite atendimento em{" "}
              <Link to="/direitos-titular" className="underline font-medium text-foreground">
                Direitos do Titular
              </Link>
              .
            </span>
          </div>
        </section>
      </div>

      <CookiePreferencesModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        currentPreferences={preferences}
        onSave={saveCustom}
      />
    </div>
  );
}
