import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert, CheckCircle2, ChevronRight, Send, Clock, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { catalogQueryOptions } from "@/lib/queries";
import { maskPhone, isValidPhone } from "@/lib/phone";

export const Route = createFileRoute("/direitos-titular")({
  head: () => ({
    meta: [
      { title: "Direitos do Titular de Dados (LGPD) — Serralheria Metal Arts" },
      {
        name: "description",
        content:
          "Canal oficial para exercer seus direitos como titular de dados sob a LGPD (Art. 18): acesso, correção, exclusão e revogação de consentimento.",
      },
      { property: "og:title", content: "Direitos do Titular de Dados — Serralheria Metal Arts" },
      { property: "og:url", content: "https://www.serralheriametalarts.com.br/direitos-titular" },
    ],
    links: [{ rel: "canonical", href: "https://www.serralheriametalarts.com.br/direitos-titular" }],
  }),
  component: DataSubjectRightsPage,
});

function DataSubjectRightsPage() {
  const { data } = useQuery({ ...catalogQueryOptions, throwOnError: false });
  const [requestType, setRequestType] = useState<string>("acesso");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [protocol, setProtocol] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 3) {
      toast.error("Por favor, informe seu nome completo.");
      return;
    }

    if (!isValidPhone(phone)) {
      toast.error("Informe um telefone/WhatsApp válido com DDD.");
      return;
    }

    // Gera um protocolo único de atendimento LGPD
    const generatedProtocol = `LGPD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setProtocol(generatedProtocol);
    setSubmitted(true);

    toast.success("Solicitação registrada com sucesso!");

    // Opcional: abre WhatsApp da loja com o protocolo formatado
    const rawNumber = data?.settings?.whatsapp_number || "5511999999999";
    const typeLabel =
      requestType === "acesso"
        ? "Acesso aos dados pessoais"
        : requestType === "correcao"
          ? "Correção ou atualização de dados"
          : requestType === "exclusao"
            ? "Exclusão / Anonimização de dados"
            : requestType === "revogacao"
              ? "Revogação de consentimento de marketing"
              : "Outras informações sobre tratamento";

    const message = encodeURIComponent(
      `🔒 *SOLICITAÇÃO DE DIREITOS LGPD (Art. 18)*\n` +
        `Protocolo: *${generatedProtocol}*\n` +
        `Titular: ${name}\n` +
        `Telefone: ${phone}\n` +
        (email ? `E-mail: ${email}\n` : "") +
        `Tipo: ${typeLabel}\n` +
        `Detalhes: ${details || "Não informado"}\n\n` +
        `Solicito o atendimento no prazo legal de até 15 dias conforme a Lei Geral de Proteção de Dados.`,
    );

    window.open(`https://wa.me/${rawNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="container-page pt-24 pb-16 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground transition-colors">
          Página Inicial
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/privacidade" className="hover:text-foreground transition-colors">
          Privacidade
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-bold text-foreground">Direitos do Titular</span>
      </nav>

      {/* Header */}
      <header className="space-y-3 pb-8 border-b border-border/60">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <UserCheck className="h-3.5 w-3.5" /> Canal Oficial do Titular · Art. 18 LGPD
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
          Exercício de Direitos do Titular
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Preencha o formulário abaixo para confirmar a existência de dados, solicitar cópia,
          correção, eliminação de registros ou revogação de consentimento de marketing.
        </p>
      </header>

      {submitted ? (
        <div className="mt-8 p-8 rounded-2xl border border-emerald-600/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Solicitação Registrada com Sucesso</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Seu protocolo oficial de atendimento é:
          </p>
          <div className="inline-block p-3 rounded-xl bg-background border border-border font-mono text-base font-bold text-primary">
            {protocol}
          </div>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Clock className="h-3.5 w-3.5" /> Prazo legal de resposta: até 15 dias úteis (Art. 19,
            II, LGPD).
          </p>
          <div className="pt-4">
            <Button asChild variant="outline">
              <Link to="/catalogo">Voltar ao Catálogo</Link>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="request-type">Tipo de Solicitação *</Label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger id="request-type" className="w-full">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="acesso">1. Acesso aos meus dados pessoais (cópia)</SelectItem>
                <SelectItem value="correcao">
                  2. Correção de dados incompletos ou inexatos
                </SelectItem>
                <SelectItem value="exclusao">3. Eliminação / Exclusão dos meus dados</SelectItem>
                <SelectItem value="revogacao">
                  4. Revogação de consentimento para marketing
                </SelectItem>
                <SelectItem value="informacoes">5. Informações sobre compartilhamentos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="req-name">Nome Completo *</Label>
              <Input
                id="req-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="req-phone">Telefone / WhatsApp com DDD *</Label>
              <Input
                id="req-phone"
                value={phone}
                onChange={(e) => setPhone(maskPhone(e.target.value))}
                placeholder="(11) 91234-5678"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="req-email">E-mail para resposta (opcional)</Label>
            <Input
              id="req-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="req-details">Detalhamento ou Justificativa (opcional)</Label>
            <Textarea
              id="req-details"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Descreva detalhes específicos caso deseje corrigir um telefone, excluir um pedido específico ou solicitar confirmação."
            />
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground flex items-start gap-2.5">
            <ShieldAlert className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <p>
              Para a sua segurança, poderemos solicitar a confirmação de identidade por meio do
              WhatsApp ou telefone cadastrado antes de fornecer ou eliminar dados sensíveis.
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full gap-2 font-bold cursor-pointer">
            <Send className="h-4 w-4" />
            Enviar Solicitação e Gerar Protocolo
          </Button>
        </form>
      )}
    </div>
  );
}
