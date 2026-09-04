import { ArrowRight, Truck, Award, ShieldCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function HomePendingSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background pb-12 animate-in fade-in duration-150">
      {/* Hero Skeleton */}
      <section className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] lg:aspect-[1.85/1] min-h-[460px] sm:min-h-[540px] md:min-h-[620px] max-h-[860px] bg-neutral-950 overflow-hidden isolate select-none">
        <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />

        {/* Botão CTA visual no rodapé do Hero */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white/90 text-black text-xs font-black uppercase tracking-widest backdrop-blur-md shadow-2xl">
            Ver Catálogo
            <ArrowRight className="h-4 w-4" />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <div className="w-8 h-2 rounded-full bg-white animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-white/40" />
            <div className="w-2 h-2 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* Diferenciais da Loja Skeleton */}
      <section className="border-y border-border/50 bg-background py-8">
        <div className="container-page grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { label: "Entrega Agilizada", desc: "Envios rápidos para todo o Brasil", icon: Truck },
            {
              label: "Pedido via WhatsApp",
              desc: "Atendimento direto e sem complicação",
              isWa: true,
            },
            { label: "Qualidade Garantida", desc: "Produtos selecionados com rigor", icon: Award },
            { label: "Compra Segura", desc: "Transparência em todas as etapas", icon: ShieldCheck },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3.5 p-3 rounded-2xl bg-muted/20">
              <div className="p-2.5 rounded-full bg-primary/10 shrink-0">
                {item.isWa || !item.icon ? (
                  <div className="w-5 h-5 rounded-full bg-primary/20" />
                ) : (
                  <item.icon className="w-5 h-5 text-primary/40" />
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-wider text-foreground">
                  {item.label}
                </p>
                <p className="text-[11px] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mini Banners Promocionais Skeleton */}
      <section className="container-page pt-10 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl bg-muted/30 min-h-[220px] flex flex-col justify-end p-5 animate-pulse"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 rounded bg-muted/60" />
                <Skeleton className="h-3 w-1/2 rounded bg-muted/50" />
                <Skeleton className="h-8 w-24 rounded-md bg-muted/70 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vitrine de Produtos Skeleton */}
      <section className="container-page pt-14 pb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8 border-b border-border pb-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-7 w-56 rounded" />
          </div>
          <Skeleton className="h-4 w-36 rounded" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl border border-border/40 bg-card p-3 space-y-3"
            >
              <Skeleton className="w-full aspect-[4/5] rounded-xl bg-muted/60" />
              <div className="space-y-2 px-1">
                <Skeleton className="h-4 w-4/5 rounded" />
                <Skeleton className="h-3 w-2/3 rounded" />
                <div className="pt-2 flex justify-between items-center">
                  <Skeleton className="h-5 w-24 rounded" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
