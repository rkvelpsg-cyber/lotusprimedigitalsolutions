"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type {
  Task,
  TaskPriority,
  TaskStatus,
  Contact,
  Deal,
} from "@/types/crm";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  X,
  CheckCircle,
  Circle,
  Clock,
  Calendar,
  Download,
} from "lucide-react";
import {
  format,
  parseISO,
  isPast,
  isToday,
  isWithinInterval,
  startOfDay,
  endOfDay,
} from "date-fns";
import { toast } from "sonner";

const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "urgent"];
const STATUSES: TaskStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  urgent: "bg-red-100 text-red-700",
};

const EMPTY: Partial<Task> = {
  title: "",
  description: "",
  due_date: "",
  priority: "medium",
  status: "pending",
  contact_id: undefined,
  deal_id: undefined,
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "">("");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<Partial<Task>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let q = supabase
      .from("tasks")
      .select(
        "*, contact:contact_id(id,first_name,last_name), deal:deal_id(id,title)",
      )
      .order("due_date", { ascending: true, nullsFirst: false });
    if (filterStatus) q = q.eq("status", filterStatus);
    if (filterPriority) q = q.eq("priority", filterPriority);

    const [{ data: taskData }, { data: contactData }, { data: dealData }] =
      await Promise.all([
        q,
        supabase
          .from("contacts")
          .select("id,first_name,last_name")
          .order("first_name"),
        supabase
          .from("deals")
          .select("id,title")
          .not("stage", "in", '("won","lost")')
          .order("title"),
      ]);
    setTasks((taskData ?? []) as Task[]);
    setContacts((contactData ?? []) as Contact[]);
    setDeals((dealData ?? []) as Deal[]);
    setLoading(false);
  }, [filterStatus, filterPriority]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowModal(true);
  };
  const openEdit = (t: Task) => {
    setEditing(t);
    setForm({
      title: t.title,
      description: t.description ?? undefined,
      due_date: t.due_date ?? undefined,
      priority: t.priority,
      status: t.status,
      contact_id: t.contact_id ?? undefined,
      deal_id: t.deal_id ?? undefined,
    });
    setShowModal(true);
  };

  const toggleComplete = async (task: Task) => {
    const newStatus: TaskStatus =
      task.status === "completed" ? "pending" : "completed";
    const supabase = createClient();
    await supabase
      .from("tasks")
      .update({
        status: newStatus,
        completed_at:
          newStatus === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", task.id);
    toast.success(
      newStatus === "completed" ? "Task completed!" : "Task reopened",
    );
    load();
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Task title is required");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const payload: Record<string, unknown> = {
      title: form.title,
      description: form.description || null,
      due_date: form.due_date || null,
      priority: form.priority ?? "medium",
      status: form.status ?? "pending",
      contact_id: form.contact_id || null,
      deal_id: form.deal_id || null,
      created_by: user?.id,
    };
    const { data: saved, error } = editing
      ? await supabase
          .from("tasks")
          .update(payload)
          .eq("id", editing.id)
          .select()
          .single()
      : await supabase.from("tasks").insert(payload).select().single();

    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Task updated" : "Task created");
      setShowModal(false);
      if (user && saved && !editing) {
        await supabase.from("activities").insert({
          type: "task_created",
          title: `New task: ${payload.title}`,
          entity_type: "task",
          entity_id: saved.id,
          contact_id: (payload.contact_id as string) || null,
          deal_id: (payload.deal_id as string) || null,
          created_by: user.id,
        });
      }
      load();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    const supabase = createClient();
    await supabase.from("tasks").delete().eq("id", id);
    toast.success("Task deleted");
    load();
  };

  // Date-range filter + search
  const filtered = tasks.filter((t) => {
    if (!t.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateFrom || dateTo) {
      if (!t.due_date) return false;
      const due = parseISO(t.due_date);
      if (dateFrom && due < startOfDay(new Date(dateFrom))) return false;
      if (dateTo && due > endOfDay(new Date(dateTo))) return false;
    }
    return true;
  });

  // Export filtered tasks to Excel (CSV)
  const exportToExcel = () => {
    const headers = [
      "Title",
      "Status",
      "Priority",
      "Due Date",
      "Contact",
      "Deal",
    ];
    const rows = filtered.map((t) => [
      `"${t.title.replace(/"/g, '""')}"`,
      t.status,
      t.priority,
      t.due_date ? format(parseISO(t.due_date), "yyyy-MM-dd HH:mm") : "",
      t.contact
        ? `"${(t.contact as { first_name: string; last_name: string }).first_name} ${(t.contact as { first_name: string; last_name: string }).last_name}"`
        : "",
      t.deal ? `"${(t.deal as { title: string }).title}"` : "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const dateLabel =
      dateFrom || dateTo
        ? `_${dateFrom || "start"}_to_${dateTo || "end"}`
        : `_${format(new Date(), "yyyy-MM-dd")}`;
    link.download = `crm_tasks${dateLabel}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} tasks`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0B3C5D]">Tasks</h1>
          <p className="text-sm text-gray-500">
            {filtered.filter((t) => t.status !== "completed").length} open
            {(dateFrom || dateTo) && (
              <span className="ml-2 text-[#1ABC9C]">· filtered by date</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Calendar date filter toggle */}
          <div className="relative">
            <button
              onClick={() => setShowDateFilter((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-colors ${
                dateFrom || dateTo
                  ? "bg-[#1ABC9C]/10 border-[#1ABC9C] text-[#1ABC9C]"
                  : "border-gray-200 text-gray-600 hover:border-[#1ABC9C] hover:text-[#1ABC9C]"
              }`}
            >
              <Calendar className="w-4 h-4" />
              {dateFrom || dateTo ? "Date filtered" : "Filter by date"}
            </button>
            {showDateFilter && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20 w-72">
                <p className="text-xs font-semibold text-[#0B3C5D] mb-3">
                  Filter tasks by due date
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      From
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#1ABC9C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      To
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#1ABC9C]"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        setDateFrom("");
                        setDateTo("");
                      }}
                      className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Clear
                    </button>
                    <button
                      onClick={() => setShowDateFilter(false)}
                      className="flex-1 px-3 py-1.5 text-xs bg-[#0B3C5D] text-white rounded-lg hover:bg-[#0B3C5D]/90"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Export to Excel */}
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-colors"
            title="Export to Excel (CSV)"
          >
            <Download className="w-4 h-4" />
            Export
          </button>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#0B3C5D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0B3C5D]/90"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1ABC9C]"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TaskStatus | "")}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) =>
            setFilterPriority(e.target.value as TaskPriority | "")
          }
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-[#1ABC9C]" />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-16 text-sm bg-white rounded-xl border border-gray-100">
              No tasks found
            </div>
          ) : (
            filtered.map((task) => {
              const due = task.due_date ? parseISO(task.due_date) : null;
              const overdue =
                due &&
                isPast(due) &&
                !isToday(due) &&
                task.status !== "completed";
              const dueToday =
                due && isToday(due) && task.status !== "completed";
              const done = task.status === "completed";

              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-xl border px-4 py-3 flex items-start gap-3 hover:shadow-sm transition-shadow ${overdue ? "border-red-200" : "border-gray-100"}`}
                >
                  <button
                    onClick={() => toggleComplete(task)}
                    className="mt-0.5 flex-shrink-0 text-gray-300 hover:text-[#1ABC9C] transition-colors"
                  >
                    {done ? (
                      <CheckCircle className="w-5 h-5 text-[#1ABC9C]" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${done ? "line-through text-gray-400" : "text-[#0B3C5D]"}`}
                    >
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {due && (
                        <span
                          className={`text-xs flex items-center gap-0.5 ${overdue ? "text-red-500" : dueToday ? "text-orange-500" : "text-gray-400"}`}
                        >
                          <Clock className="w-3 h-3" />
                          {overdue ? "Overdue · " : dueToday ? "Today · " : ""}
                          {format(due, "d MMM, h:mm a")}
                        </span>
                      )}
                      {(task.contact as Contact) && (
                        <span className="text-xs text-gray-400">
                          👤 {(task.contact as Contact).first_name}{" "}
                          {(task.contact as Contact).last_name}
                        </span>
                      )}
                      {(task.deal as Deal) && (
                        <span className="text-xs text-gray-400">
                          💼 {(task.deal as Deal).title}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                    <button
                      onClick={() => openEdit(task)}
                      className="p-1.5 text-gray-400 hover:text-[#0B3C5D] hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-base font-semibold text-[#0B3C5D]">
                {editing ? "Edit Task" : "Add Task"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Title *
                </label>
                <input
                  value={form.title ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Priority
                  </label>
                  <select
                    value={form.priority ?? "medium"}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        priority: e.target.value as TaskPriority,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status ?? "pending"}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as TaskStatus,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Due Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={form.due_date?.slice(0, 16) ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      due_date: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Related Contact
                  </label>
                  <select
                    value={form.contact_id ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        contact_id: e.target.value || undefined,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
                  >
                    <option value="">— None —</option>
                    {contacts.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.first_name} {c.last_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Related Deal
                  </label>
                  <select
                    value={form.deal_id ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        deal_id: e.target.value || undefined,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
                  >
                    <option value="">— None —</option>
                    {deals.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-[#0B3C5D] text-white rounded-lg hover:bg-[#0B3C5D]/90 disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {saving ? "Saving…" : editing ? "Update" : "Create Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
