import type { Database } from "./database";

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type EstimateVersion = Database["public"]["Tables"]["estimate_versions"]["Row"];
export type EstimateItem = Database["public"]["Tables"]["estimate_items"]["Row"];
export type Expense = Database["public"]["Tables"]["expenses"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type ProjectFinancials = Database["public"]["Views"]["project_financials"]["Row"];

export interface EstimateVersionWithItems extends EstimateVersion {
  estimate_items: EstimateItem[];
}
