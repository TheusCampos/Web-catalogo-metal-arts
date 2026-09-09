import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldCheck, BarChart3, Megaphone, Info } from "lucide-react";
import type { ConsentPreferences } from "../types/consent.types";

interface CookiePreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPreferences: ConsentPreferences;
  onSave: (preferences: { analytics: boolean; marketing: boolean }) => void;
}

export function CookiePreferencesModal({
  open,
  onOpenChange,
  currentPreferences,
  onSave,
}: CookiePreferencesModalProps) {
  const [analytics, setAnalytics] = useState(currentPreferences.analytics);
  const [marketing, setMarketing] = useState(currentPreferences.marketing);

  useEffect(() => {
    setAnalytics(currentPreferences.analytics);
    setMarketing(currentPreferences.marketing);
  }, [currentPreferences, open]);

  const handleSave = () => {
    onSave({ analytics, marketing });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Preferências de Privacidade e Cookies
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Controle como utilizamos cookies para personalizar e mensurar sua experiência no nosso
            catálogo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* 1. Cookies Necessários */}
          <div className="rounded-xl border border-border/70 p-3.5 bg-muted/20 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-sm">Cookies Estritamente Necessários</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                Sempre Ativo
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Essenciais para o funcionamento básico do site, navegação segura, carrinho de compras
              temporário e preservação de suas opções de privacidade. Não podem ser desativados.
            </p>
          </div>

          {/* 2. Cookies Analíticos */}
          <div className="rounded-xl border border-border/70 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary shrink-0" />
                <Label htmlFor="cookie-analytics" className="font-semibold text-sm cursor-pointer">
                  Métricas e Desempenho (Analytics)
                </Label>
              </div>
              <Switch
                id="cookie-analytics"
                checked={analytics}
                onCheckedChange={setAnalytics}
                aria-label="Ativar cookies analíticos"
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Permitem entender de forma anônima quais móveis e páginas recebem mais atenção,
              medindo o tempo de carregamento e melhorando a velocidade do catálogo.
            </p>
          </div>

          {/* 3. Cookies de Marketing */}
          <div className="rounded-xl border border-border/70 p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-amber-600 shrink-0" />
                <Label htmlFor="cookie-marketing" className="font-semibold text-sm cursor-pointer">
                  Marketing e Personalização
                </Label>
              </div>
              <Switch
                id="cookie-marketing"
                checked={marketing}
                onCheckedChange={setMarketing}
                aria-label="Ativar cookies de marketing"
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Utilizados para apresentar recomendações relevantes e anúncios direcionados de acordo
              com os móveis e madeiras que você visualizou.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-lg">
            <Info className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>
              Para detalhes técnicos completos sobre os cookies utilizados, acesse nossa{" "}
              <a href="/cookies" className="underline text-foreground hover:text-primary">
                Política de Cookies
              </a>
              .
            </span>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="sm:order-1"
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} className="sm:order-2">
            Salvar Preferências
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
