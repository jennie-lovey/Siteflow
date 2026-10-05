export type ProjectStatus = "later" | "pending" | "ongoing" | "completed";
export type ProjectPriority = "high" | "medium" | "low";
export type ExpenseCategory =
  | "labour"
  | "materials"
  | "feeding"
  | "transportation"
  | "misc"
  | "unexpected";

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          project_type: string;
          status: ProjectStatus;
          priority: ProjectPriority;
          agreed_price: number | null;
          deleted_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          project_type: string;
          status?: ProjectStatus;
          priority?: ProjectPriority;
          agreed_price?: number | null;
          deleted_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      estimate_versions: {
        Row: {
          id: string;
          project_id: string;
          version_number: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          version_number: number;
        };
        Update: Partial<Database["public"]["Tables"]["estimate_versions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "estimate_versions_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      estimate_items: {
        Row: {
          id: string;
          estimate_version_id: string;
          category: string;
          description: string;
          quantity: number;
          unit_price: number;
          line_total: number;
          order_index: number;
        };
        Insert: {
          id?: string;
          estimate_version_id: string;
          category: string;
          description?: string;
          quantity?: number;
          unit_price?: number;
          order_index?: number;
        };
        Update: Partial<Database["public"]["Tables"]["estimate_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "estimate_items_estimate_version_id_fkey";
            columns: ["estimate_version_id"];
            isOneToOne: false;
            referencedRelation: "estimate_versions";
            referencedColumns: ["id"];
          }
        ];
      };
      expenses: {
        Row: {
          id: string;
          project_id: string;
          date: string;
          category: ExpenseCategory;
          description: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          date?: string;
          category: ExpenseCategory;
          description?: string;
          amount: number;
        };
        Update: Partial<Database["public"]["Tables"]["expenses"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "expenses_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      app_setup: {
        Row: { id: boolean; admin_created: boolean };
        Insert: { id?: boolean; admin_created?: boolean };
        Update: { id?: boolean; admin_created?: boolean };
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          project_id: string;
          date: string;
          work_done: string;
          remaining_work: string;
          delays_reason: string;
          general_update: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          date?: string;
          work_done?: string;
          remaining_work?: string;
          delays_reason?: string;
          general_update?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notes"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "notes_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      project_financials: {
        Row: {
          project_id: string;
          original_estimate_total: number;
          current_estimate_total: number;
          actual_spent: number;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
  };
}
