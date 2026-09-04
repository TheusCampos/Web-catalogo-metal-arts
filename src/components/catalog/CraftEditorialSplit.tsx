import { Link } from "@tanstack/react-router";
import { WoodcraftCornerDecor } from "@/components/decor/WoodcraftCornerDecor";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowRight, TreePine, Hammer, Sparkles, ShieldCheck } from "lucide-react";
import type { StoreSettings } from "@/lib/store.functions";
import { getAboutSectionData } from "@/lib/store.functions";

interface CraftEditorialSplitProps {
  settings?: StoreSettings | null;
}

const DIFF_ICONS = [TreePine, Hammer, Sparkles, ShieldCheck];

export function CraftEditorialSplit({ settings }: CraftEditorialSplitProps) {
  const whatsappNumber = settings?.whatsapp_number || "5511999999999";
  const customOrderText = encodeURIComponent(
    `Olá! Estava navegando na ${settings?.name || "loja"} e gostaria de solicitar um orçamento para um projeto sob medida em madeira nobre.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${customOrderText}`;

  // Campos gerenciados pelo Administrador no painel (com fallback dinâmico)
  const aboutData = getAboutSectionData(settings);

  return (
    <section className="relative overflow-hidden bg-[#F6F2EB] dark:bg-[#1A1714] py-16 sm:py-24 border-y border-[#E8DFD3] dark:border-stone-800/80 isolate">
      {/* Ornamentos botânicos reais nos cantos */}
      <WoodcraftCornerDecor position="top-right" variant="leaves" size="lg" className="opacity-80 dark:opacity-40" />
      <WoodcraftCornerDecor position="bottom-left" variant="leaves" size="lg" className="opacity-75 dark:opacity-35" />

      <div className="container-page relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Coluna Esquerda: Imagem Gerenciável no Admin com Forma Geométrica e Selo Redondo */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* 1. Forma geométrica atrás da imagem mostrando metade da forma (estilo arquitetônico ateliê) */}
              <div
                className="absolute -top-10 -left-10 sm:-top-14 sm:-left-14 w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-[#E2D2BE] via-[#D8C5AE] to-[#CDAF92]/60 dark:from-[#2B231B] dark:to-[#1F1A14] border-2 border-[#C9B399] dark:border-stone-700/70 z-0 shadow-sm pointer-events-none flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="w-[82%] h-[82%] rounded-full border border-dashed border-[#B89F82]/60 dark:border-stone-600/60" />
              </div>

              {/* 2. Moldura e Imagem Principal */}
              <div className="relative z-10 aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[#E8DFD3] dark:border-stone-800 bg-muted/40 group">
                <img
                  src={aboutData.imageUrl}
                  alt={aboutData.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                {/* Badge no canto inferior da foto */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 block">
                      {settings?.name || "Marcenaria Artesanal"}
                    </span>
                    <h4 className="text-base font-black uppercase tracking-tight">
                      {aboutData.badgeText}
                    </h4>
                  </div>
                  <span className="p-2.5 rounded-full bg-emerald-700/80 backdrop-blur-md text-white">
                    <TreePine className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {/* 3. Selo Redondo "Acabamento Puro" com Texto em Arco e Logo Oficial da Empresa */}
              <div
                className="absolute -bottom-8 -right-3 sm:-bottom-10 sm:-right-6 z-20 group/seal select-none"
                title="Acabamento Puro — Selamento com óleos botânicos e ceras naturais"
              >
                <div className="relative w-32 h-32 sm:w-38 sm:h-38 md:w-40 md:h-40 rounded-full bg-[#FAF7F2] dark:bg-[#1F1B17] border-2 border-[#B89F82] dark:border-stone-600 shadow-2xl flex items-center justify-center p-2">
                  {/* Borda decorativa serrilhada / tracejada interna */}
                  <div className="absolute inset-1.5 rounded-full border border-dashed border-[#B89F82]/70 dark:border-stone-500/70 pointer-events-none" />

                  {/* SVG com texto circular contínuo girando suavemente */}
                  <svg
                    viewBox="0 0 160 160"
                    className="absolute inset-0 w-full h-full animate-[spin_28s_linear_infinite] group-hover/seal:[animation-play-state:paused]"
                    aria-label="Acabamento Puro Metal Arts 100% Artesanal"
                  >
                    <defs>
                      <path
                        id="sealTextPath"
                        d="M 80, 80 m -56, 0 a 56,56 0 1,1 112,0 a 56,56 0 1,1 -112,0"
                      />
                    </defs>
                    <text className="text-[9.5px] font-black uppercase tracking-[0.22em] fill-emerald-950 dark:fill-emerald-300">
                      <textPath href="#sealTextPath" startOffset="0%">
                        ★ ACABAMENTO PURO ★ METAL ART'S ★ 100% ARTESANAL ★
                      </textPath>
                    </text>
                  </svg>

                  {/* Núcleo central com a logo oficial da Metal Art's */}
                  <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-[#14120F] shadow-inner border border-[#D9C7B4] dark:border-stone-700 flex items-center justify-center p-2.5 overflow-hidden">
                    <img
                      src="/logo-metal_arts.png"
                      alt="Metal Art's"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Coluna Direita: Narrativa da Empresa (Gerenciável no Admin, sem badge modelo anterior) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-foreground leading-tight">
                {aboutData.title}
              </h2>
              <p className="font-serif italic text-muted-foreground text-sm sm:text-base">
                {aboutData.subtitle}
              </p>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {aboutData.description}
            </p>

            {/* Diferenciais da Empresa Gerenciáveis no Admin */}
            <div className="space-y-3.5 pt-2">
              {aboutData.differentials.map((diff, idx) => {
                const Icon = DIFF_ICONS[idx % DIFF_ICONS.length] || TreePine;
                return (
                  <div key={idx} className="flex items-start gap-3.5">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                        {diff.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-normal">
                        {diff.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ações / Botões */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button
                asChild
                className="rounded-full px-6 py-5 text-xs font-black uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white shadow-md transition-all hover:scale-[1.02]"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2 fill-current" />
                  Projeto Sob Medida
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 py-5 text-xs font-bold uppercase tracking-wider border-border/80 hover:border-emerald-600/50 hover:bg-background/50"
              >
                <Link to="/catalogo" search={{ categoria: "", busca: "" }}>
                  Conhecer Produtos <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
