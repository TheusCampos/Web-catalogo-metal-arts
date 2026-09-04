import type { StoreSettings } from "@/lib/store.functions";
import { Zap } from "lucide-react";

/**
 * CONFIGURAÇÃO DO DESENVOLVEDOR:
 * Defina o texto da barra superior promocional abaixo.
 * Deixe uma string vazia ("") caso deseje ocultar a barra.
 */
export const ANNOUNCEMENT_TEXT = "";

interface AnnouncementBarProps {
  settings?: StoreSettings | null;
}

export function AnnouncementBar({ settings: _settings }: AnnouncementBarProps = {}) {
  const text = ANNOUNCEMENT_TEXT.trim();

  // Exibe a barra superior SOMENTE se houver texto configurado
  if (!text) return null;

  return (
    <div className="bg-[#FFE600] text-black py-2.5 px-4 text-center text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 border-b border-black/10 select-none animate-in fade-in duration-300">
      <Zap className="h-3.5 w-3.5 fill-black shrink-0 animate-pulse" />
      <span className="truncate">{text}</span>
    </div>
  );
}
