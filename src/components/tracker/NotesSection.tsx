"use client";

import { useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input, Label, Textarea } from "@/components/ui/Field";
import { formatDisplayDate, todayISODate } from "@/lib/utils/date";
import type { Note } from "@/types/domain";

export function NotesSection({ projectId, initialNotes }: { projectId: string; initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [date, setDate] = useState(todayISODate());
  const [workDone, setWorkDone] = useState("");
  const [remainingWork, setRemainingWork] = useState("");
  const [delaysReason, setDelaysReason] = useState("");
  const [generalUpdate, setGeneralUpdate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("notes")
      .insert({
        project_id: projectId,
        date,
        work_done: workDone.trim(),
        remaining_work: remainingWork.trim(),
        delays_reason: delaysReason.trim(),
        general_update: generalUpdate.trim(),
      })
      .select()
      .single();

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setNotes((prev) => [data, ...prev]);
    setWorkDone("");
    setRemainingWork("");
    setDelaysReason("");
    setGeneralUpdate("");
  }

  async function handleDelete(id: string) {
    const previous = notes;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    const { error: deleteError } = await supabase.from("notes").delete().eq("id", id);
    if (deleteError) {
      setError(deleteError.message);
      setNotes(previous);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold text-slate-900">Site Notes</h2>
      </CardHeader>
      <CardBody className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="sm:w-48">
            <Label htmlFor="noteDate">Date</Label>
            <Input id="noteDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="workDone">What was done today</Label>
              <Textarea id="workDone" rows={2} value={workDone} onChange={(e) => setWorkDone(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="remainingWork">What is left to be done</Label>
              <Textarea
                id="remainingWork"
                rows={2}
                value={remainingWork}
                onChange={(e) => setRemainingWork(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="delaysReason">Delays and reason</Label>
              <Textarea
                id="delaysReason"
                rows={2}
                value={delaysReason}
                onChange={(e) => setDelaysReason(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="generalUpdate">General site update</Label>
              <Textarea
                id="generalUpdate"
                rows={2}
                value={generalUpdate}
                onChange={(e) => setGeneralUpdate(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Add Note"}
          </Button>
        </form>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="space-y-4">
          {notes.length === 0 && <p className="text-sm text-slate-400">No notes yet.</p>}
          {notes.map((note) => (
            <div key={note.id} className="rounded-md border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {formatDisplayDate(note.date)}
                </p>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <dl className="mt-2 space-y-1 text-sm">
                {note.work_done && (
                  <div>
                    <dt className="font-medium text-slate-700">Done:</dt>
                    <dd className="text-slate-600">{note.work_done}</dd>
                  </div>
                )}
                {note.remaining_work && (
                  <div>
                    <dt className="font-medium text-slate-700">Remaining:</dt>
                    <dd className="text-slate-600">{note.remaining_work}</dd>
                  </div>
                )}
                {note.delays_reason && (
                  <div>
                    <dt className="font-medium text-slate-700">Delays:</dt>
                    <dd className="text-slate-600">{note.delays_reason}</dd>
                  </div>
                )}
                {note.general_update && (
                  <div>
                    <dt className="font-medium text-slate-700">Update:</dt>
                    <dd className="text-slate-600">{note.general_update}</dd>
                  </div>
                )}
              </dl>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
