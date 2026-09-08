import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  Tags,
  Images,
  Users,
  Settings,
  LogOut,
  Menu,
  ExternalLink,
  Store,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { adminApi } from "@/lib/admin.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { to: "/admin/produtos", label: "Produtos", icon: Package, exact: false },
  { to: "/admin/categorias", label: "Categorias", icon: Tags, exact: false },
  { to: "/admin/banners", label: "Banners", icon: Images, exact: false },
  { to: "/admin/leads", label: "Leads", icon: Users, exact: false },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings, exact: false },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const settingsQuery = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: adminApi.settings,
  });
  const settings = settingsQuery.data;

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const currentNav = NAV.find((item) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to),
  );

  const renderNavLinks = (onItemClick?: () => void) => (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-muted-foreground hover:bg-accent/80 hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const renderSidebarContent = (onItemClick?: () => void) => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt={settings.name || "Logo"}
              className="h-10 w-10 object-contain shrink-0 rounded-lg bg-background p-1 border border-border/60"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary font-black text-sm shrink-0">
              <Store className="h-5 w-5" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-extrabold text-sm tracking-tight truncate text-foreground">
              {settings?.name || "Painel da Loja"}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Administração
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 px-3 block mb-1">
            Menu Administrativo
          </span>
          {renderNavLinks(onItemClick)}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-border/70 space-y-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 text-xs font-semibold hover:bg-accent hover:text-foreground"
        >
          <Link to="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Ver Loja Online</span>
          </Link>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start gap-2 text-xs font-semibold text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sair da Conta</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* 1. Sidebar Fixa Lateral no Desktop (md:) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30 border-r border-border bg-card p-4">
        {renderSidebarContent()}
      </aside>

      {/* 2. Área de Conteúdo Principal */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Header no Mobile e Tablet */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Botão Hambúrguer Mobile que abre o Drawer Lateral */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden h-9 w-9 shrink-0"
                  aria-label="Abrir menu lateral"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-4 flex flex-col">
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu do Painel Administrativo</SheetTitle>
                </SheetHeader>
                {renderSidebarContent(() => setMobileOpen(false))}
              </SheetContent>
            </Sheet>

            {/* Título da Seção Atual */}
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base md:text-lg text-foreground">
                {currentNav?.label || "Painel da Loja"}
              </span>
            </div>
          </div>

          {/* Ações Rápidas no Topo */}
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-xs font-semibold">
              <Link to="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                Ver loja
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="text-xs font-semibold text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-3.5 w-3.5 mr-1" />
              Sair
            </Button>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
