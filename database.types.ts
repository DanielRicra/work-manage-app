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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      claim_slips: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          production_entry_id: string | null
          slip_type: Database["public"]["Enums"]["slip_type"] | null
          total_missing: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          production_entry_id?: string | null
          slip_type?: Database["public"]["Enums"]["slip_type"] | null
          total_missing?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          production_entry_id?: string | null
          slip_type?: Database["public"]["Enums"]["slip_type"] | null
          total_missing?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "claim_slips_production_entry_id_fkey"
            columns: ["production_entry_id"]
            isOneToOne: false
            referencedRelation: "production_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      lines: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      packaging_breakdown: {
        Row: {
          created_at: string
          id: number
          number: number
          production_entry_id: string
          quantity: number
          size: Database["public"]["Enums"]["sizes"]
        }
        Insert: {
          created_at?: string
          id?: number
          number: number
          production_entry_id?: string
          quantity: number
          size: Database["public"]["Enums"]["sizes"]
        }
        Update: {
          created_at?: string
          id?: number
          number?: number
          production_entry_id?: string
          quantity?: number
          size?: Database["public"]["Enums"]["sizes"]
        }
        Relationships: [
          {
            foreignKeyName: "packaging_breakdown_production_entry_id_fkey"
            columns: ["production_entry_id"]
            isOneToOne: false
            referencedRelation: "production_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          created_at: string
          id: string
          production_entry_id: string | null
          type: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          production_entry_id?: string | null
          type?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          production_entry_id?: string | null
          type?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photos_production_entry_id_fkey"
            columns: ["production_entry_id"]
            isOneToOne: false
            referencedRelation: "production_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      production_entries: {
        Row: {
          care_label: string | null
          color: string
          completed_garments: number | null
          created_at: string
          entry_date: string | null
          ep: string | null
          id: string
          line_id: number | null
          liquidation_status:
            | Database["public"]["Enums"]["liquidation_status"]
            | null
          notes: string | null
          oc: string
          op: string
          po_label: string | null
          quantity: number
          std_mins: number
        }
        Insert: {
          care_label?: string | null
          color: string
          completed_garments?: number | null
          created_at?: string
          entry_date?: string | null
          ep?: string | null
          id?: string
          line_id?: number | null
          liquidation_status?:
            | Database["public"]["Enums"]["liquidation_status"]
            | null
          notes?: string | null
          oc: string
          op: string
          po_label?: string | null
          quantity: number
          std_mins?: number
        }
        Update: {
          care_label?: string | null
          color?: string
          completed_garments?: number | null
          created_at?: string
          entry_date?: string | null
          ep?: string | null
          id?: string
          line_id?: number | null
          liquidation_status?:
            | Database["public"]["Enums"]["liquidation_status"]
            | null
          notes?: string | null
          oc?: string
          op?: string
          po_label?: string | null
          quantity?: number
          std_mins?: number
        }
        Relationships: [
          {
            foreignKeyName: "production_entries_line_id_fkey"
            columns: ["line_id"]
            isOneToOne: false
            referencedRelation: "lines"
            referencedColumns: ["id"]
          },
        ]
      }
      slip_piece: {
        Row: {
          claim_slip_id: string
          created_at: string
          id: string
          piece_name: string
          quantity: number
          size: Database["public"]["Enums"]["sizes"]
        }
        Insert: {
          claim_slip_id?: string
          created_at?: string
          id?: string
          piece_name: string
          quantity: number
          size: Database["public"]["Enums"]["sizes"]
        }
        Update: {
          claim_slip_id?: string
          created_at?: string
          id?: string
          piece_name?: string
          quantity?: number
          size?: Database["public"]["Enums"]["sizes"]
        }
        Relationships: [
          {
            foreignKeyName: "slip_piece_claim_slip_id_fkey"
            columns: ["claim_slip_id"]
            isOneToOne: false
            referencedRelation: "claim_slips"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_operations: {
        Row: {
          created_at: string
          id: string
          operation_name: string | null
          production_entry_id: string | null
          thread_color: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          operation_name?: string | null
          production_entry_id?: string | null
          thread_color?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          operation_name?: string | null
          production_entry_id?: string | null
          thread_color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "thread_operations_production_entry_id_fkey"
            columns: ["production_entry_id"]
            isOneToOne: false
            referencedRelation: "production_entries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      liquidation_status: "pending" | "liquidated" | "blocked"
      sizes: "XS" | "S" | "M" | "L" | "XL" | "XXL" | "3XL"
      slip_type: "faltante" | "cambio" | "perdida"
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
      liquidation_status: ["pending", "liquidated", "blocked"],
      sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],
      slip_type: ["faltante", "cambio", "perdida"],
    },
  },
} as const
