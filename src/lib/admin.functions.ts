import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type BannerRow = Database["public"]["Tables"]["banners"]["Row"];
export type LeadRow = Database["public"]["Tables"]["customer_leads"]["Row"];
export type SettingsRow = Database["public"]["Tables"]["store_settings"]["Row"];

export const getAdminProducts = createServerFn({ method: "GET" })
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

export const saveAdminProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: Database["public"]["Tables"]["products"]["Insert"] & { id?: string }) => input)
  .handler(async ({ data: input }) => {
    const { id, ...initialValues } = input;
    const currentPayload: Record<string, unknown> = { ...initialValues };

    let lastError: { message: string } | null = null;

    // Tenta salvar e, se o Supabase acusar coluna inexistente no schema cache, remove o campo dinamicamente e retenta
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
        return { success: true };
      }

      lastError = error;

      // Detecta qualquer coluna ausente apontada pelo PostgREST/Supabase
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

export const deleteAdminProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const getAdminCategories = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { data, error } = await supabaseAdmin.from("categories").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data;
  });

export const saveAdminCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: Database["public"]["Tables"]["categories"]["Insert"] & { id?: string }) => input,
  )
  .handler(async ({ data: input }) => {
    const { id, ...values } = input;
    const query = id
      ? supabaseAdmin.from("categories").update(values).eq("id", id)
      : supabaseAdmin.from("categories").insert(values);
    const { error } = await query;
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const deleteAdminCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const getAdminBanners = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { data, error } = await supabaseAdmin.from("banners").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return data;
  });

export const saveAdminBanner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: Database["public"]["Tables"]["banners"]["Insert"] & { id?: string }) => input)
  .handler(async ({ data: input }) => {
    const { id, ...values } = input;
    const query = id
      ? supabaseAdmin.from("banners").update(values).eq("id", id)
      : supabaseAdmin.from("banners").insert(values);
    const { error } = await query;
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const deleteAdminBanner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { error } = await supabaseAdmin.from("banners").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const getAdminLeads = createServerFn({ method: "GET" })
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

export const deleteAdminLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const { error } = await supabaseAdmin.from("customer_leads").delete().eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
  });

export const getAdminSettings = createServerFn({ method: "GET" })
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

export const saveAdminSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: Database["public"]["Tables"]["store_settings"]["Update"] & { id: string }) => input,
  )
  .handler(async ({ data: input }) => {
    const { id, ...values } = input;
    const { error } = await supabaseAdmin.from("store_settings").update(values).eq("id", id);
    if (error) throw new Error(error.message);
    return { success: true };
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
  settings: () => getAdminSettings(),
  saveSettings: (
    input: Database["public"]["Tables"]["store_settings"]["Update"] & { id: string },
  ) => saveAdminSettings({ data: input }),
};
