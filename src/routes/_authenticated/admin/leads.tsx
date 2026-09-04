import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
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

  const remove = useMutation({
    mutationFn: adminApi.deleteLead,
    onSuccess: () => {
      toast.success("Contato removido");
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const productName = (id: string | null) => products.data?.find((p) => p.id === id)?.name ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Leads & Intenções de Compra</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe os contatos e clientes que iniciaram pedidos direto pelo WhatsApp.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
          {leads.data?.length ?? 0} Contatos
        </div>
      </div>

      <div className="space-y-2">
        {(leads.data ?? []).map((lead) => (
          <Card key={lead.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="font-medium">{lead.name || lead.email || "Sem nome"}</p>
                <p className="text-sm text-muted-foreground">
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
                  <Trash2 className="h-4 w-4" />
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
