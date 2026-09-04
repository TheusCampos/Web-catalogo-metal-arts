import { useRef, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

/** Galeria: várias fotos extras do produto (upload comprimido ou URL). */
export function GalleryField({
  values,
  onChange,
}: {
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setBusy(true);
    try {
      const added: string[] = [];
      for (const file of Array.from(files)) {
        added.push(await uploadImage(file));
      }
      onChange([...values, ...added]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao processar imagem");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Fotos adicionais</Label>
        <span className="text-xs text-muted-foreground">{values.length} foto(s)</span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {values.map((value, index) => (
          <div
            key={`${index}-${value.slice(0, 24)}`}
            className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
          >
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Remover foto"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              className="absolute right-1 top-1 rounded-full bg-background/90 p-1"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          aria-label="Adicionar fotos"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Ou cole uma URL de imagem"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!url.trim()) return;
            onChange([...values, url.trim()]);
            setUrl("");
          }}
        >
          Adicionar
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Arquivos enviados são comprimidos para WebP antes de salvar.
      </p>
    </div>
  );
}
