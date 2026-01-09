export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_hours: {
        Row: {
          close_time: string | null
          created_at: string
          day_of_week: number
          distributor_id: string
          id: string
          is_open: boolean
          open_time: string | null
          updated_at: string
        }
        Insert: {
          close_time?: string | null
          created_at?: string
          day_of_week: number
          distributor_id: string
          id?: string
          is_open?: boolean
          open_time?: string | null
          updated_at?: string
        }
        Update: {
          close_time?: string | null
          created_at?: string
          day_of_week?: number
          distributor_id?: string
          id?: string
          is_open?: boolean
          open_time?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "distributors"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          country: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          state: string
          updated_at: string
        }
        Insert: {
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          state: string
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      discount_rules: {
        Row: {
          created_at: string
          discount_percent: number
          distributor_id: string
          id: string
          is_active: boolean
          max_quantity: number | null
          min_quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_percent: number
          distributor_id: string
          id?: string
          is_active?: boolean
          max_quantity?: number | null
          min_quantity: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_percent?: number
          distributor_id?: string
          id?: string
          is_active?: boolean
          max_quantity?: number | null
          min_quantity?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discount_rules_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "distributors"
            referencedColumns: ["id"]
          },
        ]
      }
      distributors: {
        Row: {
          accepts_card: boolean | null
          accepts_cash: boolean | null
          accepts_pix: boolean | null
          city_id: string | null
          cnpj: string | null
          complement: string | null
          created_at: string
          delivery_fee: number | null
          email: string | null
          id: string
          is_active: boolean
          is_verified: boolean
          logo_url: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          min_order_value: number | null
          name: string
          neighborhood: string | null
          number: string | null
          phone: string | null
          slug: string
          street: string | null
          updated_at: string
          user_id: string
          whatsapp: string | null
          zip_code: string | null
        }
        Insert: {
          accepts_card?: boolean | null
          accepts_cash?: boolean | null
          accepts_pix?: boolean | null
          city_id?: string | null
          cnpj?: string | null
          complement?: string | null
          created_at?: string
          delivery_fee?: number | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          logo_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          min_order_value?: number | null
          name: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          slug: string
          street?: string | null
          updated_at?: string
          user_id: string
          whatsapp?: string | null
          zip_code?: string | null
        }
        Update: {
          accepts_card?: boolean | null
          accepts_cash?: boolean | null
          accepts_pix?: boolean | null
          city_id?: string | null
          cnpj?: string | null
          complement?: string | null
          created_at?: string
          delivery_fee?: number | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_verified?: boolean
          logo_url?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          min_order_value?: number | null
          name?: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          slug?: string
          street?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distributors_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_programs: {
        Row: {
          created_at: string
          description: string | null
          distributor_id: string
          id: string
          is_enabled: boolean
          min_order_value: number | null
          points_per_order: number
          program_name: string | null
          reward_description: string | null
          reward_threshold: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          distributor_id: string
          id?: string
          is_enabled?: boolean
          min_order_value?: number | null
          points_per_order?: number
          program_name?: string | null
          reward_description?: string | null
          reward_threshold?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          distributor_id?: string
          id?: string
          is_enabled?: boolean
          min_order_value?: number | null
          points_per_order?: number
          program_name?: string | null
          reward_description?: string | null
          reward_threshold?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_programs_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: true
            referencedRelation: "distributors"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          order_id: string | null
          read: boolean | null
          subscription_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          order_id?: string | null
          read?: boolean | null
          subscription_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          order_id?: string | null
          read?: boolean | null
          subscription_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_drafts: {
        Row: {
          brands_data: Json | null
          business_hours_data: Json | null
          created_at: string
          current_step: number
          distributor_data: Json | null
          id: string
          products_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brands_data?: Json | null
          business_hours_data?: Json | null
          created_at?: string
          current_step?: number
          distributor_data?: Json | null
          id?: string
          products_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brands_data?: Json | null
          business_hours_data?: Json | null
          created_at?: string
          current_step?: number
          distributor_data?: Json | null
          id?: string
          products_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_liters: number
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_liters: number
          product_name: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_liters?: number
          product_name?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          change_for: number | null
          created_at: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          delivery_city: string | null
          delivery_complement: string | null
          delivery_fee: number
          delivery_neighborhood: string | null
          delivery_number: string | null
          delivery_period: Database["public"]["Enums"]["delivery_period"] | null
          delivery_state: string | null
          delivery_street: string
          delivery_zip_code: string | null
          discount_amount: number
          distributor_id: string
          id: string
          loyalty_points_earned: number | null
          notes: string | null
          order_number: number
          order_type: Database["public"]["Enums"]["order_type"]
          payment_method: Database["public"]["Enums"]["payment_method"]
          scheduled_date: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          change_for?: number | null
          created_at?: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          delivery_city?: string | null
          delivery_complement?: string | null
          delivery_fee?: number
          delivery_neighborhood?: string | null
          delivery_number?: string | null
          delivery_period?:
            | Database["public"]["Enums"]["delivery_period"]
            | null
          delivery_state?: string | null
          delivery_street: string
          delivery_zip_code?: string | null
          discount_amount?: number
          distributor_id: string
          id?: string
          loyalty_points_earned?: number | null
          notes?: string | null
          order_number?: number
          order_type?: Database["public"]["Enums"]["order_type"]
          payment_method: Database["public"]["Enums"]["payment_method"]
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Update: {
          change_for?: number | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          delivery_city?: string | null
          delivery_complement?: string | null
          delivery_fee?: number
          delivery_neighborhood?: string | null
          delivery_number?: string | null
          delivery_period?:
            | Database["public"]["Enums"]["delivery_period"]
            | null
          delivery_state?: string | null
          delivery_street?: string
          delivery_zip_code?: string | null
          discount_amount?: number
          distributor_id?: string
          id?: string
          loyalty_points_earned?: number | null
          notes?: string | null
          order_number?: number
          order_type?: Database["public"]["Enums"]["order_type"]
          payment_method?: Database["public"]["Enums"]["payment_method"]
          scheduled_date?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "distributors"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          paid_at: string | null
          payment_method: string | null
          reference_period_end: string | null
          reference_period_start: string | null
          status: string
          subscription_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          reference_period_end?: string | null
          reference_period_start?: string | null
          status?: string
          subscription_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_method?: string | null
          reference_period_end?: string | null
          reference_period_start?: string | null
          status?: string
          subscription_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string | null
          created_at: string
          description: string | null
          distributor_id: string
          id: string
          image_url: string | null
          is_available: boolean
          liters: number
          name: string
          price: number
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string
          description?: string | null
          distributor_id: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          liters: number
          name: string
          price: number
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string
          description?: string | null
          distributor_id?: string
          id?: string
          image_url?: string | null
          is_available?: boolean
          liters?: number
          name?: string
          price?: number
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: false
            referencedRelation: "distributors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          neighborhood: string | null
          number: string | null
          phone: string | null
          state: string | null
          street: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          canceled_at: string | null
          created_at: string
          distributor_id: string
          expires_at: string | null
          id: string
          plan: Database["public"]["Enums"]["subscription_plan"]
          price: number
          started_at: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
        }
        Insert: {
          canceled_at?: string | null
          created_at?: string
          distributor_id: string
          expires_at?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          price: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
        }
        Update: {
          canceled_at?: string | null
          created_at?: string
          distributor_id?: string
          expires_at?: string | null
          id?: string
          plan?: Database["public"]["Enums"]["subscription_plan"]
          price?: number
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_distributor_id_fkey"
            columns: ["distributor_id"]
            isOneToOne: true
            referencedRelation: "distributors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_expired_subscriptions: { Args: never; Returns: undefined }
      check_expiring_subscriptions: { Args: never; Returns: undefined }
      has_active_subscription: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      notify_scheduled_orders_today: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "distributor" | "customer"
      delivery_period: "manha" | "tarde" | "noite"
      notification_type:
        | "new_order"
        | "new_scheduled_order"
        | "subscription_expiring"
        | "subscription_expired"
        | "payment_failed"
        | "low_stock"
        | "customer_review"
        | "system_update"
        | "scheduled_reminder"
      order_status: "novo" | "em_entrega" | "concluido" | "cancelado"
      order_type: "immediate" | "scheduled"
      payment_method: "dinheiro" | "pix" | "cartao" | "cartao_entrega"
      subscription_plan: "monthly" | "annual"
      subscription_status: "active" | "pending" | "expired" | "canceled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "distributor", "customer"],
      delivery_period: ["manha", "tarde", "noite"],
      notification_type: [
        "new_order",
        "new_scheduled_order",
        "subscription_expiring",
        "subscription_expired",
        "payment_failed",
        "low_stock",
        "customer_review",
        "system_update",
        "scheduled_reminder",
      ],
      order_status: ["novo", "em_entrega", "concluido", "cancelado"],
      order_type: ["immediate", "scheduled"],
      payment_method: ["dinheiro", "pix", "cartao", "cartao_entrega"],
      subscription_plan: ["monthly", "annual"],
      subscription_status: ["active", "pending", "expired", "canceled"],
    },
  },
} as const
