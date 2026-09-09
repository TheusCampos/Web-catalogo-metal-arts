export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      banners: {
        Row: {
          created_at: string;
          cta_link: string | null;
          cta_text: string | null;
          id: string;
          image_url: string | null;
          is_active: boolean;
          mobile_image_url: string | null;
          sort_order: number;
          subtitle: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          cta_link?: string | null;
          cta_text?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          mobile_image_url?: string | null;
          sort_order?: number;
          subtitle?: string | null;
          title?: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          cta_link?: string | null;
          cta_text?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          mobile_image_url?: string | null;
          sort_order?: number;
          subtitle?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          id: string;
          image_url: string | null;
          name: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      customer_leads: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          marketing_consent: boolean;
          consent_at: string | null;
          privacy_version: string | null;
          name: string | null;
          phone: string | null;
          product_interest: string | null;
          source: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          marketing_consent?: boolean;
          consent_at?: string | null;
          privacy_version?: string | null;
          name?: string | null;
          phone?: string | null;
          product_interest?: string | null;
          source?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          marketing_consent?: boolean;
          consent_at?: string | null;
          privacy_version?: string | null;
          name?: string | null;
          phone?: string | null;
          product_interest?: string | null;
          source?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customer_leads_product_interest_fkey";
            columns: ["product_interest"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          category_id: string | null;
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          images: string[];
          is_active: boolean;
          is_featured: boolean;
          name: string;
          price: number;
          promo_price?: number | null;
          sort_order?: number;
          stock_quantity?: number | null;
          sku?: string | null;
          sizes?: string[] | string | null;
          colors?: string[] | string | null;
          wood_type?: string | null;
          dimensions?: string | null;
          finish?: string | null;
          weight_kg?: number | null;
          updated_at?: string;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          images?: string[];
          is_active?: boolean;
          is_featured?: boolean;
          name: string;
          price?: number;
          promo_price?: number | null;
          sort_order?: number;
          stock_quantity?: number | null;
          sku?: string | null;
          sizes?: string[] | string | null;
          colors?: string[] | string | null;
          wood_type?: string | null;
          dimensions?: string | null;
          finish?: string | null;
          weight_kg?: number | null;
          updated_at?: string;
        };
        Update: {
          category_id?: string | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          images?: string[];
          is_active?: boolean;
          is_featured?: boolean;
          name?: string;
          price?: number;
          promo_price?: number | null;
          sort_order?: number;
          stock_quantity?: number | null;
          sku?: string | null;
          sizes?: string[] | string | null;
          colors?: string[] | string | null;
          wood_type?: string | null;
          dimensions?: string | null;
          finish?: string | null;
          weight_kg?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      store_settings: {
        Row: {
          about_badge_text: string | null;
          about_description: string | null;
          about_differentials: Json | null;
          about_image_url: string | null;
          about_subtitle: string | null;
          about_title: string | null;
          address: string | null;
          announcement_text: string | null;
          catalog_banner_url: string | null;
          cnpj: string | null;
          created_at: string;
          facebook_url: string | null;
          id: string;
          instagram_url: string | null;
          logo_url: string | null;
          max_installments: number | null;
          name: string;
          primary_color: string;
          services_header: Json | null;
          services_items: Json | null;
          services_woods: Json | null;
          trust_badge_1: string | null;
          trust_badge_2: string | null;
          trust_badge_3: string | null;
          trust_badge_4: string | null;
          updated_at: string;
          whatsapp_number: string;
        };
        Insert: {
          about_badge_text?: string | null;
          about_description?: string | null;
          about_differentials?: Json | null;
          about_image_url?: string | null;
          about_subtitle?: string | null;
          about_title?: string | null;
          address?: string | null;
          announcement_text?: string | null;
          catalog_banner_url?: string | null;
          cnpj?: string | null;
          created_at?: string;
          facebook_url?: string | null;
          id?: string;
          instagram_url?: string | null;
          logo_url?: string | null;
          max_installments?: number | null;
          name?: string;
          primary_color?: string;
          services_header?: Json | null;
          services_items?: Json | null;
          services_woods?: Json | null;
          trust_badge_1?: string | null;
          trust_badge_2?: string | null;
          trust_badge_3?: string | null;
          trust_badge_4?: string | null;
          updated_at?: string;
          whatsapp_number?: string;
        };
        Update: {
          about_badge_text?: string | null;
          about_description?: string | null;
          about_differentials?: Json | null;
          about_image_url?: string | null;
          about_subtitle?: string | null;
          about_title?: string | null;
          address?: string | null;
          announcement_text?: string | null;
          catalog_banner_url?: string | null;
          cnpj?: string | null;
          created_at?: string;
          facebook_url?: string | null;
          id?: string;
          instagram_url?: string | null;
          logo_url?: string | null;
          max_installments?: number | null;
          name?: string;
          primary_color?: string;
          services_header?: Json | null;
          services_items?: Json | null;
          services_woods?: Json | null;
          trust_badge_1?: string | null;
          trust_badge_2?: string | null;
          trust_badge_3?: string | null;
          trust_badge_4?: string | null;
          updated_at?: string;
          whatsapp_number?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          action: string;
          admin_email: string | null;
          admin_id: string | null;
          created_at: string;
          details: Json | null;
          id: string;
          ip_address: string | null;
          resource: string;
          resource_id: string | null;
        };
        Insert: {
          action: string;
          admin_email?: string | null;
          admin_id?: string | null;
          created_at?: string;
          details?: Json | null;
          id?: string;
          ip_address?: string | null;
          resource: string;
          resource_id?: string | null;
        };
        Update: {
          action?: string;
          admin_email?: string | null;
          admin_id?: string | null;
          created_at?: string;
          details?: Json | null;
          id?: string;
          ip_address?: string | null;
          resource?: string;
          resource_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
