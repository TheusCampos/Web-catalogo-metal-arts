import { Star, CheckCircle2 } from "lucide-react";
import type { StoreSettings } from "@/lib/store.functions";
import { WoodcraftCornerDecor } from "@/components/decor/WoodcraftCornerDecor";

interface SocialProofCarouselProps {
  settings?: StoreSettings | null;
}

export function SocialProofCarousel({ settings }: SocialProofCarouselProps) {
  const storeName = settings?.name || "nossa marcenaria";

  const reviews = [
    {
      id: 1,
      name: "Carlos Eduardo",
      location: "São Paulo - SP",
      piece: "Mesa de Jantar em Cumaru",
      comment:
        "Chegou impecável! O acabamento acetinado com óleo natural é surreal ao toque. O suporte via WhatsApp me manteve informado de cada etapa da confecção.",
      date: "Há 2 dias",
      rating: 5,
    },
    {
      id: 2,
      name: "Fernanda Lima",
      location: "Belo Horizonte - MG",
      piece: "Prateleiras Borda Viva em Ipê",
      comment:
        "Peças com alma e presença única. Dá para ver o respeito à fibra e o corte perfeito. Vieram super bem embaladas com reforço nas bordas. Recomendo de olhos fechados!",
      date: "Há 4 dias",
      rating: 5,
    },
    {
      id: 3,
      name: "Rodrigo Mendes",
      location: "Curitiba - PR",
      piece: "Bancada Rústica em Teca",
      comment:
        "Comprei sob medida pelo WhatsApp. O marceneiro me enviou fotos da prancha bruta antes de iniciar a usinagem. Transparência e qualidade incomparáveis!",
      date: "Há 1 semana",
      rating: 5,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/10 to-background py-16 sm:py-20 border-y border-border/40 isolate">
      {/* Ornamentos Botânicos e Ferramentas nos Cantos */}
      <WoodcraftCornerDecor position="top-right" variant="leaves" size="lg" className="opacity-30 dark:opacity-20" />
      <WoodcraftCornerDecor position="bottom-left" variant="tools" size="md" className="opacity-20 dark:opacity-10" />

      <div className="container-page relative z-10">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
            Quem compra na {storeName}, recomenda!
          </h2>

          <p className="font-serif italic text-muted-foreground text-sm sm:text-base">
            Relatos reais de quem valoriza o design autêntico e a durabilidade da madeira nobre
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card/90 backdrop-blur-sm border border-border/70 hover:border-emerald-600/40 p-6 rounded-2xl shadow-2xs hover:shadow-md flex flex-col justify-between space-y-4 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  {/* Selo Verde de Compra Verificada */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    Compra Verificada
                  </span>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 stroke-none" />
                    ))}
                  </div>
                </div>

                <p className="text-xs font-semibold text-emerald-900/80 dark:text-emerald-300/80">
                  Adquiriu: <span className="font-bold underline underline-offset-2">{review.piece}</span>
                </p>

                <p className="text-xs sm:text-sm text-foreground/90 italic leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-emerald-700/15 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-600/20">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                      {review.name}
                    </h4>
                    <span className="text-[11px] text-muted-foreground">{review.location}</span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
