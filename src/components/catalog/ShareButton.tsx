import { useState } from "react";
import { Share2, Check, Facebook, Twitter, MessageCircle, Send, Link2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ShareButton({
  productId,
  productName,
  className,
  label,
  responsiveLabel = false,
}: {
  productId: string;
  productName: string;
  className?: string;
  label?: string;
  responsiveLabel?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/produto/${productId}` : "";
  const text = `Olha esse produto: ${productName}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
      setOpen(false);
    } catch {
      toast.error("Não foi possível copiar o link.");
    }
  }

  function shareTo(platform: "whatsapp" | "facebook" | "twitter" | "telegram") {
    let shareUrl = "";
    switch (platform) {
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Compartilhar ${productName}`}
          className={cn(
            "inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full border border-border bg-background/90 px-3 py-2 text-sm backdrop-blur transition-colors hover:border-primary hover:text-primary shrink-0",
            className,
          )}
        >
          {copied ? (
            <Check className="h-4 w-4 shrink-0" />
          ) : (
            <Share2 className="h-4 w-4 shrink-0" />
          )}
          {label ? (
            <span className={responsiveLabel ? "hidden md:inline" : undefined}>{label}</span>
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => shareTo("whatsapp")}>
          <MessageCircle className="mr-2 h-4 w-4 text-[#25D366]" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareTo("facebook")}>
          <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareTo("twitter")}>
          <Twitter className="mr-2 h-4 w-4 text-[#1DA1F2]" />
          <span>Twitter (X)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => shareTo("telegram")}>
          <Send className="mr-2 h-4 w-4 text-[#0088cc]" />
          <span>Telegram</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy}>
          <Link2 className="mr-2 h-4 w-4" />
          <span>Copiar Link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
