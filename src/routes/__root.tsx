import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/sora/500.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import appCss from "@/styles.css?url";
import { catalogQueryOptions } from "@/lib/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { StoreTheme } from "@/components/StoreTheme";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O endereço acessado não existe ou foi movido.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Esta página não carregou
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado. Tente novamente ou volte ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  );
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": "https://www.serralheriametalarts.com.br/#organization",
      name: "Serralheria Metal Arts",
      url: "https://www.serralheriametalarts.com.br/",
      logo: "https://www.serralheriametalarts.com.br/logo-metal_arts.png",
      image: "https://www.serralheriametalarts.com.br/img-footer.jpg",
      description:
        "Ateliê de serralheria artística, marcenaria fina e móveis sob medida em madeira maciça nobre e design industrial.",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        addressCountry: "BR",
      },
      areaServed: "BR",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.serralheriametalarts.com.br/#website",
      url: "https://www.serralheriametalarts.com.br/",
      name: "Serralheria Metal Arts",
      publisher: {
        "@id": "https://www.serralheriametalarts.com.br/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.serralheriametalarts.com.br/catalogo?busca={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: ({ context }) => context.queryClient.ensureQueryData(catalogQueryOptions),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "author", content: "Serralheria Metal Arts" },
      { name: "publisher", content: "Serralheria Metal Arts" },
      { name: "theme-color", content: "#1B3B2B" },
      { name: "geo.region", content: "BR" },
      { property: "og:site_name", content: "Serralheria Metal Arts" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      {
        property: "og:image",
        content: "https://www.serralheriametalarts.com.br/logo-metal_arts.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "https://www.serralheriametalarts.com.br/logo-metal_arts.png",
      },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/logo-metal_arts.png" },
      { rel: "apple-touch-icon", href: "/logo-metal_arts.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function StoreChrome() {
  // Falha de leitura não pode derrubar o site: o layout continua renderizando.
  const { data } = useQuery({ ...catalogQueryOptions, throwOnError: false });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/auth");
  const settings = data?.settings ?? null;

  return (
    <>
      <StoreTheme settings={settings} />
      {isAdminArea ? (
        <Outlet />
      ) : (
        <div className="flex min-h-screen flex-col">
          <AnnouncementBar settings={settings} />
          <Header settings={settings} />
          <main className="flex-1 min-h-[calc(100vh-200px)]">
            {/* Rotas filhas renderizam aqui. */}
            <Outlet />
          </main>
          <Footer settings={settings} />
          <WhatsAppFloat settings={settings} />
        </div>
      )}
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreChrome />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
