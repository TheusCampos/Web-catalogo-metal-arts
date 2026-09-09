import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Loader2, MapPin, Phone, Mail, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { StoreSettings } from "@/lib/store.functions";
import { recordLead } from "@/lib/store.functions";
import { onlyDigits } from "@/lib/phone";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Footer({ settings }: { settings: StoreSettings | null }) {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  async function subscribe(event: React.FormEvent) {
    event.preventDefault();
    if (!EMAIL_RE.test(email.trim()) || email.trim().length > 255) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    setSaving(true);
    try {
      await recordLead({ data: { email: email.trim().toLowerCase(), source: "newsletter" } });
      setEmail("");
      toast.success("Pronto! Você receberá nossas ofertas e novidades.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível cadastrar.");
    } finally {
      setSaving(false);
    }
  }

  const rawNumber = settings?.whatsapp_number || "";
  let digits = onlyDigits(rawNumber);
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  const whatsappLink = digits ? `https://wa.me/${digits}` : null;
  const storeName = settings?.name || "Nosso Catálogo";

  return (
    <footer
      suppressHydrationWarning
      className="mt-16 relative border-t border-[#E8DFD3] dark:border-stone-800/80 bg-[#F6F2EB] dark:bg-[#1A1714] text-foreground overflow-hidden"
    >
      <div className="container-page py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Coluna 1: Marca & Redes Sociais */}
          <div className="space-y-4">
            <Link
              to="/"
              suppressHydrationWarning
              className="inline-block group"
              aria-label={`Página inicial de ${storeName}`}
            >
              {settings?.logo_url ? (
                <img
                  src={settings.logo_url}
                  alt={storeName}
                  loading="lazy"
                  width="240"
                  height="96"
                  suppressHydrationWarning
                  className="h-20 sm:h-24 w-auto max-w-[240px] object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span
                  suppressHydrationWarning
                  className="font-extrabold text-2xl uppercase tracking-tight text-foreground"
                >
                  {storeName}
                </span>
              )}
            </Link>
            <p className="text-xs font-medium text-stone-600 dark:text-stone-400 leading-relaxed">
              Catálogo online exclusivo com atendimento rápido e personalizado direto pelo WhatsApp.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-stone-800 border border-[#E8DFD3] dark:border-stone-700 text-foreground shadow-xs transition-colors hover:bg-emerald-700 hover:text-white hover:border-emerald-700"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-stone-800 border border-[#E8DFD3] dark:border-stone-700 text-foreground shadow-xs transition-colors hover:bg-emerald-700 hover:text-white hover:border-emerald-700"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.2-.7.2s-.8 1-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
                  </svg>
                </a>
              )}
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white dark:bg-stone-800 border border-[#E8DFD3] dark:border-stone-700 text-foreground shadow-xs transition-colors hover:bg-emerald-700 hover:text-white hover:border-emerald-700"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">
              Links Rápidos
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              <li>
                <Link
                  to="/"
                  className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo"
                  search={{ categoria: "", busca: "" }}
                  className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                >
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link
                  to="/favoritos"
                  className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                >
                  Meus Favoritos
                </Link>
              </li>
              {whatsappLink && (
                <li>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-600 dark:text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    Atendimento WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Coluna 3: Endereço & Atendimento */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">
              Atendimento & Contato
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-stone-600 dark:text-stone-400">
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-emerald-700 dark:text-emerald-500 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.whatsapp_number && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-700 dark:text-emerald-500 shrink-0" />
                  <span className="font-bold text-foreground">{settings.whatsapp_number}</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-700 dark:text-emerald-500 shrink-0" />
                <span>Atendimento Online Seg a Sáb</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Novidades & Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground">
              Receba Novidades
            </h4>
            <p className="text-xs font-medium text-stone-600 dark:text-stone-400">
              Cadastre seu e-mail para receber ofertas exclusivas e lançamentos em primeira mão.
            </p>
            <form onSubmit={subscribe} className="space-y-2">
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  aria-label="E-mail para novidades"
                  maxLength={255}
                  className="pr-10 h-10 text-xs rounded-lg bg-white dark:bg-stone-900 text-foreground placeholder:text-stone-400 border-[#D8C5AE] dark:border-stone-700 shadow-xs focus-visible:ring-emerald-600"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={saving}
                  className="absolute right-1 top-1 h-8 w-8 rounded-md bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs"
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                  <span className="sr-only">Inscrever-se</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Linha Inferior de Direitos & LGPD */}
        <div className="mt-12 pt-6 border-t border-[#E8DFD3] dark:border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-stone-500 dark:text-stone-400">
          <p>
            © {new Date().getFullYear()} {storeName}
            {settings?.cnpj ? ` · CNPJ: ${settings.cnpj}` : ""}. Todos os direitos reservados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link
              to="/privacidade"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              Privacidade
            </Link>
            <span>·</span>
            <Link
              to="/cookies"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              Cookies
            </Link>
            <span>·</span>
            <Link
              to="/direitos-titular"
              className="hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
            >
              Direitos do Titular
            </Link>
          </div>

          <p className="text-[11px]">Catálogo Online — Pedidos via WhatsApp</p>
        </div>
      </div>
    </footer>
  );
}
