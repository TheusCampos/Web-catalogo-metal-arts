import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, History, User, Clock, Terminal } from "lucide-react";
import { adminApi } from "@/lib/admin.functions";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/auditoria")({
  component: AdminAuditLogsPage,
});

function AdminAuditLogsPage() {
  const logs = useQuery({
    queryKey: ["admin", "audit-logs"],
    queryFn: adminApi.auditLogs,
  });

  const getActionBadge = (action: string) => {
    if (action.includes("CREATE")) {
      return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300";
    }
    if (action.includes("DELETE")) {
      return "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300";
    }
    if (action.includes("EXPORT")) {
      return "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300";
    }
    return "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-300";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Logs de Auditoria Administrativa
          </h1>
          <p className="text-sm text-muted-foreground">
            Rastreabilidade de ações, alterações de produtos, exportações de leads e exclusões (LGPD
            e Governança).
          </p>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
          {logs.data?.length ?? 0} Registros
        </div>
      </div>

      <div className="space-y-3">
        {(logs.data ?? []).map((log) => (
          <Card key={log.id} className="overflow-hidden border-border/80">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getActionBadge(
                      log.action,
                    )}`}
                  >
                    {log.action}
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    Recurso: <code className="bg-muted px-1.5 py-0.5 rounded">{log.resource}</code>
                  </span>
                  {log.resource_id && (
                    <span className="text-[11px] text-muted-foreground font-mono truncate max-w-[200px]">
                      ID: {log.resource_id}
                    </span>
                  )}
                </div>

                {log.details && Object.keys(log.details).length > 0 && (
                  <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border border-border/40 font-mono mt-1">
                    {JSON.stringify(log.details)}
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col items-end sm:items-end justify-between text-xs text-muted-foreground gap-1 shrink-0">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {log.admin_email || log.admin_id || "Admin"}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="h-3 w-3" />
                  {formatDateTime(log.created_at)}
                </span>
                {log.ip_address && (
                  <span className="text-[10px] text-muted-foreground/80">IP: {log.ip_address}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {logs.data?.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            Nenhuma ação administrativa registrada ainda.
          </div>
        ) : null}
      </div>
    </div>
  );
}
