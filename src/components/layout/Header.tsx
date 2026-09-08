import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useFavoritesStore } from "@/stores/favorites.store";
import { CartSheet } from "@/components/catalog/CartSheet";
import type { StoreSettings } from "@/lib/store.functions";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/favoritos", label: "Favoritos" },
] as const;

export function Header({ settings }: { settings: StoreSettings | null }) {
  const count = useFavoritesStore((s) => s.ids.length);
  const ready = useFavoritesStore((s) => s.ready);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHomePage && !scrolled;

  return (
    <header
      suppressHydrationWarning
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
        isTransparent
          ? "bg-transparent text-white border-b border-white/10"
          : "bg-background/95 backdrop-blur border-b border-border text-foreground shadow-sm",
      )}
    >
      <div className="container-page flex h-16 sm:h-20 items-center justify-between gap-4 transition-all duration-300">
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          onClick={() => setOpen(false)}
          suppressHydrationWarning
        >
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt={settings.name ?? "Logo da loja"}
              width="200"
              height="64"
              suppressHydrationWarning
              className="h-12 sm:h-16 w-auto max-w-[180px] sm:max-w-[220px] object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span
              suppressHydrationWarning
              className={cn(
                "font-extrabold text-xl tracking-tight uppercase",
                isTransparent ? "text-white" : "text-foreground",
              )}
            >
              {settings?.name ?? "Catálogo"}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "text-xs font-bold uppercase tracking-wider transition-colors",
                isTransparent
                  ? "text-white/80 hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
              activeProps={{
                className: isTransparent
                  ? "text-white font-extrabold"
                  : "text-foreground font-extrabold",
              }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/favoritos"
            className={cn(
              "relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
              isTransparent ? "hover:bg-white/10 text-white" : "hover:bg-accent text-foreground",
            )}
            aria-label="Meus favoritos"
          >
            <Heart className="h-5 w-5" />
            {ready && count > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {count}
              </span>
            ) : null}
          </Link>

          <CartSheet />

          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors md:hidden",
              isTransparent ? "hover:bg-white/10 text-white" : "hover:bg-accent text-foreground",
            )}
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t md:hidden transition-colors",
          isTransparent
            ? "border-white/10 bg-black/80 backdrop-blur text-white"
            : "border-border bg-background text-foreground",
          open ? "block" : "hidden",
        )}
      >
        <nav className="container-page flex flex-col py-2">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "py-3 text-xs font-bold uppercase tracking-wider",
                isTransparent ? "text-white/80" : "text-muted-foreground",
              )}
              activeProps={{
                className: isTransparent
                  ? "text-white font-extrabold"
                  : "text-foreground font-extrabold",
              }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
