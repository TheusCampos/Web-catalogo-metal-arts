import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type BannerRow = Database["public"]["Tables"]["banners"]["Row"];
export type AuditLogRow = Database["public"]["Tables"]["audit_logs"]["Row"];

/**
 * Registra evento administrativo na tabela de auditoria (audit_logs).
 */
async function recordAuditLog({
  userId,
  email,
  action,
  resource,
  resourceId,
  details,
}: {
  userId?: string | null | undefined;
  email?: string | null | undefined;
  action: string;
  resource: string;
  resourceId?: string | null | undefined;
  details?: Record<string, unknown> | undefined;
}) {
  try {
    const ip =
      getRequestIP() ||
      getRequestHeader("cf-connecting-ip") ||
      getRequestHeader("x-forwarded-for") ||
      "admin";

    const insertPayload: Database["public"]["Tables"]["audit_logs"]["Insert"] = {
      action,
      resource,
      admin_id: userId || null,
      admin_email: email || null,
      resource_id: resourceId || null,
      ip_address: ip,
      ...(details ? { details: JSON.parse(JSON.stringify(details)) } : {}),
    };

    await supabaseAdmin.from("audit_logs").insert(insertPayload);
  } catch (err) {
    console.error("Falha ao registrar audit_log:", err);
  }
}

const getAdminProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });

const saveAdminProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: Database["public"]["Tables"]["products"]["Insert"] & { id?: string }) => input)
  .handler(async ({ data: input, context }) => {
    const { id, ...initialValues } = input;
    const currentPayload: Record<string, unknown> = { ...initialValues };

    let lastError: { message: string } | null = null;

    for (let attempt = 0; attempt < 6; attempt++) {
      const query = id
        ? supabaseAdmin
            .from("products")
            .update(currentPayload as unknown as Database["public"]["Tables"]["products"]["Update"])
            .eq("id", id)
        : supabaseAdmin
            .from("products")
            .insert(
              currentPayload as unknown as Database["public"]["Tables"]["products"]["Insert"],
            );

      const { error } = await query;
      if (!error) {
        await recordAuditLog({
          userId: context.userId,
          email: (context.claims as { email?: string })?.email,
          action: id ? "UPDATE_PRODUCT" : "CREATE_PRODUCT",
          resource: "products",
          resourceId: id || undefined,
          details: { name: currentPayload["name"], price: currentPayload["price"] },
        });
        return { success: true };
      }

      lastError = error;

      const match = error.message.match(/Could not find the '(\w+)' column/);
      if (match && match[1] && match[1] in currentPayload) {
        delete currentPayload[match[1]];
        continue;
      }

      break;
    }

    if (lastError) throw new Error(lastError.message);
    return { success: true };
  });

const deleteAdminProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: string) => id)
  .handler(async ({ data: id, context }) => {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);

    await recordAuditLog({
      userId: context.userId,
      email: (context.claims as { email?: string })?.email,
      action: "DELETE_PRODUCT",
      resource: "products",
      resourceId: id,
    });

    return { success: true };
  });

const getAdminCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { data, error } = await supabaseAdmin.from("categories").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data;
  });

const saveAdminCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: Database["public"]["Tables"]["categories"]["Insert"] & { id?: string }) => input,
  )
  .handler(async ({ data: input, context }) => {
    const { id, ...values } = input;
    const query = id
      ? supabaseAdmin.from("categories").update(values).eq("id", id)
      : supabaseAdmin.from("categories").insert(values);
    const { error } = await query;
    if (error) throw new Error(error.message);

    await recordAuditLog({
      userId: context.userId,
      email: (context.claims as { email?: string })?.email,
      action: id ? "UPDATE_CATEGORY" : "CREATE_CATEGORY",
      resource: "categories",
      resourceId: id || undefined,
      details: { name: values.name },
    });

    return { success: true };
  });

const deleteAdminCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: string) => id)
  .handler(async ({ data: id, context }) => {
    const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);

    await recordAuditLog({
      userId: context.userId,
      email: (context.claims as { email?: string })?.email,
      action: "DELETE_CATEGORY",
      resource: "categories",
      resourceId: id,
    });

    return { success: true };
  });

const getAdminBanners = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { data, error } = await supabaseAdmin.from("banners").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data;
  });

const saveAdminBanner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: Database["public"]["Tables"]["banners"]["Insert"] & { id?: string }) => input)
  .handler(async ({ data: input, context }) => {
    const { id, ...values } = input;
    const query = id
      ? supabaseAdmin.from("banners").update(values).eq("id", id)
      : supabaseAdmin.from("banners").insert(values);
    const { error } = await query;
    if (error) throw new Error(error.message);

    await recordAuditLog({
      userId: context.userId,
      email: (context.claims as { email?: string })?.email,
      action: id ? "UPDATE_BANNER" : "CREATE_BANNER",
      resource: "banners",
      resourceId: id || undefined,
      details: { title: values.title },
    });

    return { success: true };
  });

const deleteAdminBanner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: string) => id)
  .handler(async ({ data: id, context }) => {
    const { error } = await supabaseAdmin.from("banners").delete().eq("id", id);
    if (error) throw new Error(error.message);

    await recordAuditLog({
      userId: context.userId,
      email: (context.claims as { email?: string })?.email,
      action: "DELETE_BANNER",
      resource: "banners",
      resourceId: id,
    });

    return { success: true };
  });

const getAdminLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("customer_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data;
  });

const deleteAdminLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: string) => id)
  .handler(async ({ data: id, context }) => {
    const { error } = await supabaseAdmin.from("customer_leads").delete().eq("id", id);
    if (error) throw new Error(error.message);

    await recordAuditLog({
      userId: context.userId,
      email: (context.claims as { email?: string })?.email,
      action: "DELETE_LEAD",
      resource: "leads",
      resourceId: id,
    });

    return { success: true };
  });

/**
 * Exportação segura de leads para CSV com autorização e registro de auditoria LGPD.
 */
const exportAdminLeadsCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: leads, error } = await supabaseAdmin
      .from("customer_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    await recordAuditLog({
      userId: context.userId,
      email: (context.claims as { email?: string })?.email,
      action: "EXPORT_LEADS",
      resource: "leads",
      details: { totalExported: leads?.length ?? 0 },
    });

    const header = [
      "ID",
      "Nome",
      "Telefone",
      "Email",
      "Origem",
      "Consentimento Marketing",
      "Data Consentimento",
      "Data Cadastro",
    ];

    const rows = (leads ?? []).map((lead) => [
      `"${lead.id}"`,
      `"${(lead.name || "").replace(/"/g, '""')}"`,
      `"${(lead.phone || "").replace(/"/g, '""')}"`,
      `"${(lead.email || "").replace(/"/g, '""')}"`,
      `"${lead.source}"`,
      `"${lead.marketing_consent ? "Sim" : "Não"}"`,
      `"${lead.consent_at ? new Date(lead.consent_at).toLocaleString("pt-BR") : "—"}"`,
      `"${new Date(lead.created_at).toLocaleString("pt-BR")}"`,
    ]);

    const csvContent = "\uFEFF" + [header.join(";"), ...rows.map((r) => r.join(";"))].join("\r\n");
    return { csv: csvContent, count: leads?.length ?? 0 };
  });

/**
 * Busca histórico de logs de auditoria administrativa.
 */
const getAdminAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data as AuditLogRow[];
  });

const getAdminSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { data, error } = await supabaseAdmin
      .from("store_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

const saveAdminSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: Database["public"]["Tables"]["store_settings"]["Update"] & { id: string }) => input,
  )
  .handler(async ({ data: input, context }) => {
    const { id, ...values } = input;
    const { error } = await supabaseAdmin.from("store_settings").update(values).eq("id", id);
    if (error) throw new Error(error.message);

    await recordAuditLog({
      userId: context.userId,
      email: (context.claims as { email?: string })?.email,
      action: "UPDATE_SETTINGS",
      resource: "settings",
      resourceId: id,
    });

    return { success: true };
  });

/**
 * Expurgo seguro de contatos e leads mais antigos que um determinado período (retenção LGPD).
 */
const purgeOldLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((days: number) => days)
  .handler(async ({ data: days, context }) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const { data: toDelete, error: selectError } = await supabaseAdmin
      .from("customer_leads")
      .select("id")
      .lt("created_at", cutoff.toISOString());

    if (selectError) throw new Error(selectError.message);

    const ids = (toDelete ?? []).map((l) => l.id);
    if (ids.length === 0) return { purged: 0 };

    const { error: deleteError } = await supabaseAdmin
      .from("customer_leads")
      .delete()
      .in("id", ids);

    if (deleteError) throw new Error(deleteError.message);

    await recordAuditLog({
      userId: context.userId,
      email: (context.claims as { email?: string })?.email,
      action: "PURGE_OLD_LEADS",
      resource: "leads",
      details: { purgedCount: ids.length, retentionDays: days, cutoffDate: cutoff.toISOString() },
    });

    return { purged: ids.length };
  });

export const adminApi = {
  products: () => getAdminProducts(),
  saveProduct: (input: Database["public"]["Tables"]["products"]["Insert"] & { id?: string }) =>
    saveAdminProduct({ data: input }),
  deleteProduct: (id: string) => deleteAdminProduct({ data: id }),
  categories: () => getAdminCategories(),
  saveCategory: (input: Database["public"]["Tables"]["categories"]["Insert"] & { id?: string }) =>
    saveAdminCategory({ data: input }),
  deleteCategory: (id: string) => deleteAdminCategory({ data: id }),
  banners: () => getAdminBanners(),
  saveBanner: (input: Database["public"]["Tables"]["banners"]["Insert"] & { id?: string }) =>
    saveAdminBanner({ data: input }),
  deleteBanner: (id: string) => deleteAdminBanner({ data: id }),
  leads: () => getAdminLeads(),
  deleteLead: (id: string) => deleteAdminLead({ data: id }),
  purgeOldLeads: (days: number) => purgeOldLeads({ data: days }),
  exportLeadsCsv: () => exportAdminLeadsCsv(),
  auditLogs: () => getAdminAuditLogs(),
  settings: () => getAdminSettings(),
  saveSettings: (
    input: Database["public"]["Tables"]["store_settings"]["Update"] & { id: string },
  ) => saveAdminSettings({ data: input }),
};
