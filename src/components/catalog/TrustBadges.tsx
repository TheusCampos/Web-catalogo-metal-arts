import type { StoreSettings } from "@/lib/store.functions";
import { Truck, TreePine, Sparkles, MessageCircle } from "lucide-react";
import { WoodcraftCornerDecor } from "@/components/decor/WoodcraftCornerDecor";

/**
 * CONFIGURAÇÃO DO CATÁLOGO:
 * Diferenciais e selos de marcenaria fina, sustentabilidade e confiança.
 */
export const TRUST_BADGES = [
  {
    icon: "leaf",
    title: "Manejo Sustentável",
    desc: "Madeiras nobres certificadas",
  },
  {
    icon: "craft",
    title: "Marcenaria Fina",
    desc: "Feito à mão com óleos naturais",
  },
  {
    icon: "truck",
    title: "Envio Especializado",
    desc: "Proteção reforçada para todo Brasil",
  },
  {
    icon: "whatsapp",
    title: "Pedido no WhatsApp",
    desc: "Atendimento direto com o ateliê",
  },
] as const;

interface TrustBadgesProps {
  settings?: StoreSettings | null;
}

export function TrustBadges({ settings: _settings }: TrustBadgesProps = {}) {
  const items = TRUST_BADGES;

  return (
    <section className="relative overflow-hidden border-y border-border/50 bg-gradient-to-r from-background via-muted/10 to-background py-8 isolate">
      {/* Detalhe botânico sutil no canto da barra */}
      <WoodcraftCornerDecor position="top-right" variant="subtle-branch" size="sm" className="opacity-40" />

      <div className="container-page grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-card/70 border border-border/60 hover:border-emerald-600/40 hover:bg-card transition-all duration-300 shadow-2xs hover:shadow-xs"
          >
            {item.icon === "whatsapp" ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-[#25D366] shrink-0 transition-transform duration-300 group-hover:scale-110">
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
            ) : item.icon === "leaf" ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <TreePine className="h-5 w-5 stroke-[2]" />
              </div>
            ) : item.icon === "craft" ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Sparkles className="h-5 w-5 stroke-[2]" />
              </div>
            ) : (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0 transition-transform duration-300 group-hover:scale-110">
                <Truck className="h-5 w-5 stroke-[2]" />
              </div>
            )}

            <div className="space-y-0.5 min-w-0">
              <h4 className="font-bold text-xs uppercase tracking-wider text-foreground truncate group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
