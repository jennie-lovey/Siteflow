"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { FieldError, Input, Label, Select, Textarea } from "@/components/ui/Field";
import { EXPENSE_CATEGORY_OPTIONS } from "@/lib/constants";
import { formatNaira } from "@/lib/utils/currency";
import { formatDisplayDate, todayISODate } from "@/lib/utils/date";
import { expenseFormSchema } from "@/lib/validation";
import type { Expense } from "@/types/domain";
import type { ExpenseCategory } from "@/types/database";

export function ExpensesSection({ projectId, initialExpenses }: { projectId: string; initialExpenses: Expense[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [date, setDate] = useState(todayISODate());
  const [category, setCategory] = useState<ExpenseCategory>("materials");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = expenseFormSchema.safeParse({ date, category, description, amount });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("expenses")
      .insert({
        project_id: projectId,
        date: parsed.data.date,
        category: parsed.data.category,
        description: parsed.data.description,
        amount: parsed.data.amount,
      })
      .select()
      .single();

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setExpenses((prev) => [data, ...prev]);
    setDescription("");
    setAmount("");
  }

  async function handleDelete(id: string) {
    const previous = expenses;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    const { error: deleteError } = await supabase.from("expenses").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      setExpenses(previous);
    }
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">Expenses</h2>
        <p className="text-sm font-medium text-slate-700">Total: {formatNaira(total)}</p>
      </CardHeader>
      <CardBody className="space-y-5">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-5 sm:items-end">
          <div>
            <Label htmlFor="expenseDate">Date</Label>
            <Input id="expenseDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="expenseCategory">Category</Label>
            <Select
              id="expenseCategory"
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            >
              {EXPENSE_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="expenseDescription">Description</Label>
            <Textarea
              id="expenseDescription"
              rows={1}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Paid mason for block laying"
            />
          </div>
          <div>
            <Label htmlFor="expenseAmount">Amount (₦)</Label>
            <Input
              id="expenseAmount"
              type="number"
              min={0}
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <FieldError message={errors.amount} />
          </div>
          <div className="sm:col-span-5">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </form>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Description</th>
                <th className="py-2 pr-3 text-right">Amount</th>
                <th className="py-2 pl-3" />
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400">
                    No expenses logged yet.
                  </td>
                </tr>
              )}
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-3 text-slate-600">{formatDisplayDate(expense.date)}</td>
                  <td className="py-2 pr-3 text-slate-700">
                    {EXPENSE_CATEGORY_OPTIONS.find((o) => o.value === expense.category)?.label}
                  </td>
                  <td className="py-2 pr-3 text-slate-500">{expense.description}</td>
                  <td className="py-2 pr-3 text-right font-medium text-slate-900">
                    {formatNaira(expense.amount)}
                  </td>
                  <td className="py-2 pl-3 text-right">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
