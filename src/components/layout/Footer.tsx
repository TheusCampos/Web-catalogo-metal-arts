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
      className="mt-16 relative border-t border-[#E8DFD3] dark:border-stone-800/80 text-black overflow-hidden"
      style={{
        textShadow:
          "0 0 4px #ffffff, 0 0 8px #ffffff, 0 1px 2px #ffffff, 1px 1px 2px #ffffff, -1px -1px 2px #ffffff",
      }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img-footer.jpg')" }}
        aria-hidden="true"
      />

      <div className="container-page py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Coluna 1: Marca & Redes Sociais */}
          <div className="space-y-4">
            {settings?.logo_url ? (
              <img
                src={settings.logo_url}
                alt={storeName}
                loading="lazy"
                width="180"
                height="40"
                className="h-10 w-auto max-w-[180px] object-contain drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]"
              />
            ) : (
              <span className="font-extrabold text-xl uppercase tracking-tight text-black">
                {storeName}
              </span>
            )}
            <p className="text-xs font-medium text-black leading-relaxed">
              Catálogo online exclusivo com atendimento rápido e personalizado direto pelo WhatsApp.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                  style={{ textShadow: "none" }}
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                  style={{ textShadow: "none" }}
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                  style={{ textShadow: "none" }}
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-black">
              Links Rápidos
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-black">
              <li>
                <Link to="/" className="hover:text-primary transition-colors text-black">
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo"
                  search={{ categoria: "", busca: "" }}
                  className="hover:text-primary transition-colors text-black"
                >
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link to="/favoritos" className="hover:text-primary transition-colors text-black">
                  Meus Favoritos
                </Link>
              </li>
              {whatsappLink && (
                <li>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors text-black"
                  >
                    Atendimento WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Coluna 3: Endereço & Atendimento */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-black">
              Atendimento & Contato
            </h4>
            <ul className="space-y-2.5 text-xs font-medium text-black">
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.whatsapp_number && (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary shrink-0 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]" />
                  <span className="font-bold text-black">{settings.whatsapp_number}</span>
                </li>
              )}
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]" />
                <span>Atendimento Online Seg a Sáb</span>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Novidades & Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-black">
              Receba Novidades
            </h4>
            <p className="text-xs font-medium text-black">
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
                  className="pr-10 h-10 text-xs rounded-lg bg-white/90 text-black placeholder:text-stone-600 border-black/20 shadow-sm"
                  style={{ textShadow: "none" }}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={saving}
                  className="absolute right-1 top-1 h-8 w-8 rounded-md bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
                  style={{ textShadow: "none" }}
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

        {/* Linha Inferior de Direitos */}
        <div className="mt-12 pt-6 border-t border-black/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-black">
          <p>
            © {new Date().getFullYear()} {storeName}. Todos os direitos reservados.
          </p>
          <p className="text-[11px]">Catálogo Online — Pedidos via WhatsApp</p>
        </div>
      </div>
    </footer>
  );
}
