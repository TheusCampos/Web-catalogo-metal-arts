import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2, Download, CheckCircle, XCircle, Loader2, ShieldCheck } from "lucide-react";
import { adminApi } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/leads")({
  component: AdminLeads,
});

function AdminLeads() {
  const queryClient = useQueryClient();
  const leads = useQuery({ queryKey: ["admin", "leads"], queryFn: adminApi.leads });
  const products = useQuery({ queryKey: ["admin", "products"], queryFn: adminApi.products });
  const [exporting, setExporting] = useState(false);

  const remove = useMutation({
    mutationFn: adminApi.deleteLead,
    onSuccess: () => {
      toast.success("Contato removido");
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const result = await adminApi.exportLeadsCsv();
      if (!result?.csv) throw new Error("Falha ao gerar arquivo.");

      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `leads_metal_arts_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`${result.count} leads exportados com registro de auditoria.`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao exportar CSV.");
    } finally {
      setExporting(false);
    }
  };

  const productName = (id: string | null) => products.data?.find((p) => p.id === id)?.name ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Leads & Intenções de Compra</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe os contatos, pedidos iniciados no WhatsApp e status de consentimento LGPD.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={exporting || (leads.data?.length ?? 0) === 0}
            className="gap-1.5 cursor-pointer text-xs"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Exportar CSV
          </Button>
          <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
            {leads.data?.length ?? 0} Contatos
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {(leads.data ?? []).map((lead) => (
          <Card key={lead.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm text-foreground">
                    {lead.name || lead.email || "Sem nome"}
                  </p>
                  {lead.marketing_consent ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle className="h-2.5 w-2.5" /> Marketing Autorizado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                      <XCircle className="h-2.5 w-2.5" /> Sem Marketing
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {[lead.phone, lead.email, productName(lead.product_interest)]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-muted px-2 py-1 text-xs capitalize">
                  {lead.source}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(lead.created_at)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Excluir contato"
                  onClick={() => remove.mutate(lead.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {leads.data?.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Nenhum contato recebido ainda.
          </p>
        ) : null}
      </div>
    </div>
  );
}
