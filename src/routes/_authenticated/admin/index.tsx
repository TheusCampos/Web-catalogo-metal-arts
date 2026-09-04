import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Tags, Images, Users } from "lucide-react";
import { adminApi } from "@/lib/admin.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const products = useQuery({ queryKey: ["admin", "products"], queryFn: adminApi.products });
  const categories = useQuery({ queryKey: ["admin", "categories"], queryFn: adminApi.categories });
  const banners = useQuery({ queryKey: ["admin", "banners"], queryFn: adminApi.banners });
  const leads = useQuery({ queryKey: ["admin", "leads"], queryFn: adminApi.leads });

  const stats = [
    { label: "Produtos", value: products.data?.length ?? 0, icon: Package, to: "/admin/produtos" },
    {
      label: "Categorias",
      value: categories.data?.length ?? 0,
      icon: Tags,
      to: "/admin/categorias",
    },
    { label: "Banners", value: banners.data?.length ?? 0, icon: Images, to: "/admin/banners" },
    { label: "Leads", value: leads.data?.length ?? 0, icon: Users, to: "/admin/leads" },
  ] as const;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Visão geral</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.to}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-5">
                <stat.icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimos contatos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(leads.data ?? []).slice(0, 5).map((lead) => (
            <div
              key={lead.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium">{lead.name || lead.email || "Sem nome"}</p>
                <p className="text-xs text-muted-foreground">{lead.phone || lead.source}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(lead.created_at)}
              </span>
            </div>
          ))}
          {(leads.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum contato recebido ainda.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
