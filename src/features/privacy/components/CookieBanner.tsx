import { Link } from "@tanstack/react-router";
import { Cookie, Settings, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useConsent } from "../hooks/useConsent";
import { CookiePreferencesModal } from "./CookiePreferencesModal";

export function CookieBanner() {
  const {
    preferences,
    hasChosen,
    isModalOpen,
    setIsModalOpen,
    acceptAll,
    rejectNonEssential,
    saveCustom,
  } = useConsent();

  // Não renderiza se o usuário já fez sua escolha no navegador
  if (hasChosen) {
    return (
      <CookiePreferencesModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        currentPreferences={preferences}
        onSave={saveCustom}
      />
    );
  }

  return (
    <>
      <aside
        aria-label="Aviso de Privacidade e Consentimento de Cookies"
        className="fixed bottom-0 inset-x-0 z-50 p-3 sm:p-4 bg-background/95 backdrop-blur-md border-t border-border shadow-2xl animate-in fade-in slide-in-from-bottom duration-300"
      >
        <div className="container-page max-w-6xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-foreground">
                Sua privacidade e seus cookies no Catálogo Metal Arts
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Utilizamos cookies essenciais para o funcionamento do catálogo e, com seu
                consentimento, cookies de métricas e personalização para aprimorar sua experiência.
                Conheça nossa{" "}
                <Link
                  to="/privacidade"
                  className="underline font-medium text-foreground hover:text-primary"
                >
                  Política de Privacidade
                </Link>{" "}
                e{" "}
                <Link
                  to="/cookies"
                  className="underline font-medium text-foreground hover:text-primary"
                >
                  Política de Cookies
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-xs h-9 gap-1.5 cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5" />
              Configurar
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={rejectNonEssential}
              className="text-xs h-9 gap-1.5 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              Apenas Essenciais
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={acceptAll}
              className="text-xs h-9 gap-1.5 cursor-pointer font-bold"
            >
              <Check className="h-3.5 w-3.5" />
              Aceitar Todos
            </Button>
          </div>
        </div>
      </aside>

      <CookiePreferencesModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        currentPreferences={preferences}
        onSave={saveCustom}
      />
    </>
  );
}
