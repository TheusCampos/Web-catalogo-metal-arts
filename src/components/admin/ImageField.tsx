import { useRef, useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { uploadImage } from "@/lib/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/**
 * Campo de imagem: aceita upload de arquivo (comprimido para WebP e salvo no banco)
 * ou uma URL externa colada pelo lojista.
 */
export function ImageField({
  value,
  onChange,
  label = "Imagem",
  maxSide = 3840,
  quality = 0.92,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  maxSide?: number;
  quality?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadImage(file, { maxSide, quality }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao processar imagem");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-start gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {value ? (
            <>
              <img src={value} alt="Pré-visualização" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Remover imagem"
                className="absolute right-1 top-1 rounded-full bg-background/90 p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : null}
        </div>
        <div className="flex-1 space-y-2">
          <Input
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Cole uma URL de imagem"
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Enviar arquivo
          </Button>
          <p className="text-xs text-muted-foreground">
            Alta definição em WebP otimizado (até 4K / 3840px).
          </p>
        </div>
      </div>
    </div>
  );
}
