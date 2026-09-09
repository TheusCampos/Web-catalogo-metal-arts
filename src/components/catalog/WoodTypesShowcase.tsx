import { Link } from "@tanstack/react-router";
import { WoodcraftCornerDecor } from "@/components/decor/WoodcraftCornerDecor";
import {
  Sparkles,
  ArrowRight,
  Compass,
  TreePine,
  Hammer,
  MessageCircle,
  Ruler,
  CheckCircle2,
} from "lucide-react";
import type { StoreSettings } from "@/lib/store.functions";
import { getServicesSectionData } from "@/lib/store.functions";
import { Button } from "@/components/ui/button";

interface WoodServicesShowcaseProps {
  settings?: StoreSettings | null;
}

const SERVICE_ICONS = [Compass, TreePine, Sparkles, Hammer, Ruler];

export function WoodTypesShowcase({ settings }: WoodServicesShowcaseProps) {
  const whatsappNumber = settings?.whatsapp_number || "5511999999999";
  const consultText = encodeURIComponent(
    `Olá! Gostaria de saber mais sobre os serviços de marcenaria e projetos sob medida da ${settings?.name || "loja"}.`,
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${consultText}`;

  // Dados gerenciáveis no Admin (com fallback dinâmico)
  const servicesData = getServicesSectionData(settings);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/10 to-background py-16 sm:py-24 border-y border-border/40 isolate">
      {/* Ornamentos botânicos reais nos cantos da seção */}
      <WoodcraftCornerDecor position="top-left" variant="leaves" size="lg" className="opacity-90" />

      <div className="container-page relative z-10 space-y-16 sm:space-y-20">
        {/* Cabeçalho Humanizado & Minimalista Gerenciável no Admin */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-foreground">
            {servicesData.title}
          </h2>

          <p className="font-serif italic text-muted-foreground text-sm sm:text-base tracking-wide">
            {servicesData.subtitle}
          </p>

          <div className="w-16 h-0.5 bg-emerald-600/40 mx-auto rounded-full mt-2" />

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
            {servicesData.description}
          </p>
        </div>

        {/* 1. Grid dos 3 Serviços Principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {servicesData.items.map((service, idx) => {
            const Icon = SERVICE_ICONS[idx % SERVICE_ICONS.length] || Compass;
            return (
              <div
                key={idx}
                className="group relative bg-card border border-border/70 hover:border-emerald-600/40 flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Imagem do Serviço */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted/30">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-emerald-800/85 backdrop-blur-md text-emerald-100 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <Icon className="w-3 h-3 text-emerald-300" />
                    {service.badge}
                  </span>
                </div>

                {/* Texto do Serviço */}
                <div className="p-5 sm:p-6 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{service.desc}</p>
                  </div>

                  <div className="pt-4 border-t border-border/40">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group/link"
                    >
                      <span>Solicitar orçamento</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. As 3 Madeiras Nobres que Trabalhamos */}
        <div className="pt-8 border-t border-border/50 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400 block">
                Matéria-Prima Certificada
              </span>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
                As 3 Madeiras Nobres que Trabalhamos
              </h3>
            </div>
            <p className="font-serif italic text-xs sm:text-sm text-muted-foreground max-w-md">
              Selecionamos apenas espécies de manejo legal, densidade comprovada e estabilidade para
              o clima brasileiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicesData.woods.map((wood) => (
              <div
                key={wood.id}
                className="group relative bg-card/80 backdrop-blur-sm border border-border/70 hover:border-emerald-600/40 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Foto da Madeira com Selo */}
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted/40 shadow-inner">
                    <img
                      src={wood.imageUrl}
                      alt={wood.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-800 text-white shadow-xs">
                      {wood.tag}
                    </span>
                    <span className="absolute bottom-2 left-2.5 text-[11px] font-bold text-white font-mono italic">
                      {wood.scientificName}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black uppercase tracking-tight text-foreground group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                      {wood.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      {wood.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border/50 space-y-1 text-[11px]">
                    <div>
                      <span className="text-muted-foreground font-semibold">Tonalidade: </span>
                      <span className="font-bold text-foreground">{wood.colorTone}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-semibold">Ideal para: </span>
                      <span className="font-bold text-foreground">{wood.bestFor}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/40">
                  <Link
                    to="/catalogo"
                    search={{ categoria: "", busca: wood.name.split(" ")[0] ?? "" }}
                    className="inline-flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group/link"
                  >
                    <span>Ver peças em {wood.name.split(" ")[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Caixa de Contato Direto & Humanizado com o Marceneiro */}
        <div className="bg-muted/30 border border-border/70 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-emerald-800 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Atendimento Humanizado Direto do Ateliê
            </span>
            <h4 className="text-lg sm:text-xl font-black uppercase tracking-tight text-foreground">
              Tem uma ideia de projeto ou precisa de ajuda na escolha da madeira?
            </h4>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Envie uma foto da sua sala ou as medidas que calculamos o orçamento e indicamos a
              espécie perfeita.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              asChild
              className="rounded-full px-6 py-5 text-xs font-black uppercase tracking-wider bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md transition-all hover:scale-105"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2 fill-current" />
                Falar com o Marceneiro
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
