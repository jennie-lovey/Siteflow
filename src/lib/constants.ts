import type { ExpenseCategory, ProjectPriority, ProjectStatus } from "@/types/database";

export const PROJECT_TYPE_PRESETS = [
  "Bungalow",
  "Duplex",
  "Land Clearing",
  "Fencing",
  "Gatehouse Construction",
  "Renovation",
  "Other",
] as const;

export const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "later", label: "Later" },
  { value: "pending", label: "Pending" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];

export const PRIORITY_OPTIONS: { value: ProjectPriority; label: string }[] = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const ESTIMATE_CATEGORY_PRESETS = [
  "Blocks",
  "Cement",
  "Iron Rods",
  "Roofing Materials",
  "Labour",
  "Transportation",
  "Miscellaneous",
  "Add Category",
] as const;

export const EXPENSE_CATEGORY_OPTIONS: { value: ExpenseCategory; label: string }[] = [
  { value: "labour", label: "Labour Payments" },
  { value: "materials", label: "Materials Purchased" },
  { value: "feeding", label: "Feeding" },
  { value: "transportation", label: "Transportation" },
  { value: "misc", label: "Miscellaneous" },
  { value: "unexpected", label: "Unexpected / Out-of-Estimate" },
];

export const STATUS_BADGE_STYLES: Record<ProjectStatus, string> = {
  later: "bg-slate-100 text-slate-600",
  pending: "bg-amber-100 text-amber-700",
  ongoing: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export const STATUS_DOT_STYLES: Record<ProjectStatus, string> = {
  later: "bg-slate-400",
  pending: "bg-amber-500",
  ongoing: "bg-blue-500",
  completed: "bg-emerald-500",
};

export const PRIORITY_BADGE_STYLES: Record<ProjectPriority, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-orange-100 text-orange-700",
  low: "bg-slate-100 text-slate-600",
};
