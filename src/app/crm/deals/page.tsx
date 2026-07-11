"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Deal, DealStage, Contact, Company } from "@/types/crm";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  X,
  IndianRupee,
  Calendar,
  Download,
} from "lucide-react";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";

const STAGES: {
  stage: DealStage;
  label: string;
  color: string;
  headerColor: string;
  probability: number;
}[] = [
  {
    stage: "lead",
    label: "Lead",
    color: "bg-slate-50  border-slate-200",
    headerColor: "bg-slate-500",
    probability: 10,
  },
  {
    stage: "qualified",
    label: "Qualified",
    color: "bg-blue-50   border-blue-200",
    headerColor: "bg-blue-500",
    probability: 25,
  },
  {
    stage: "proposal",
    label: "Proposal",
    color: "bg-yellow-50 border-yellow-200",
    headerColor: "bg-yellow-500",
    probability: 50,
  },
  {
    stage: "negotiation",
    label: "Negotiation",
    color: "bg-orange-50 border-orange-200",
    headerColor: "bg-orange-500",
    probability: 75,
  },
  {
    stage: "won",
    label: "Won ✓",
    color: "bg-green-50  border-green-200",
    headerColor: "bg-green-500",
    probability: 100,
  },
  {
    stage: "lost",
    label: "Lost ✗",
    color: "bg-red-50    border-red-200",
    headerColor: "bg-red-400",
    probability: 0,
  },
];

const EMPTY: Partial<Deal> = {
  title: "",
  value: 0,
  currency: "INR",
  stage: "lead",
  probability: 10,
  contact_id: undefined,
  company_id: undefined,
  expected_close_date: undefined,
  description: "",
};

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [form, setForm] = useState<Partial<Deal>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: dealData }, { data: contactData }, { data: companyData }] =
      await Promise.all([
        supabase
          .from("deals")
          .select(
            "*, contact:contact_id(id,first_name,last_name), company:company_id(id,name)",
          )
          .order("created_at", { ascending: false }),
        supabase
          .from("contacts")
          .select("id,first_name,last_name")
          .order("first_name"),
        supabase.from("companies").select("id,name").order("name"),
      ]);
    setDeals((dealData ?? []) as Deal[]);
    setContacts((contactData ?? []) as Contact[]);
    setCompanies((companyData ?? []) as Company[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = (stage?: DealStage) => {
    setEditing(null);
    setForm({ ...EMPTY, stage: stage ?? "lead" });
    setShowModal(true);
  };
  const openEdit = (d: Deal) => {
    setEditing(d);
    setForm({
      title: d.title,
      value: d.value,
      currency: "INR",
      stage: d.stage,
      probability: d.probability,
      contact_id: d.contact_id ?? undefined,
      company_id: d.company_id ?? undefined,
      expected_close_date: d.expected_close_date ?? undefined,
      description: d.description ?? undefined,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title) {
      toast.error("Deal title is required");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const payload: Record<string, unknown> = {
      title: form.title,
      value: form.value ?? 0,
      currency: "INR",
      stage: form.stage ?? "lead",
      probability: form.probability ?? 10,
      contact_id: form.contact_id || null,
      company_id: form.company_id || null,
      expected_close_date: form.expected_close_date || null,
      description: form.description || null,
      created_by: user?.id,
    };
    const { data: saved, error } = editing
      ? await supabase
          .from("deals")
          .update(payload)
          .eq("id", editing.id)
          .select()
          .single()
      : await supabase.from("deals").insert(payload).select().single();

    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Deal updated" : "Deal created");
      if (user && saved) {
        await supabase.from("activities").insert({
          type: "deal_created",
          title: `${editing ? "Deal updated" : "New deal"}: ${payload.title} (${payload.stage})`,
          entity_type: "deal",
          entity_id: saved.id,
          deal_id: saved.id,
          contact_id: (payload.contact_id as string) || null,
          company_id: (payload.company_id as string) || null,
          created_by: user.id,
        });
      }
      setShowModal(false);
      load();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this deal?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("deals").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deal deleted");
      load();
    }
  };

  // Drag-and-drop stage change
  const handleDrop = async (newStage: DealStage, e: React.DragEvent) => {
    e.preventDefault();
    if (!dragging) return;
    const deal = deals.find((d) => d.id === dragging);
    if (!deal || deal.stage === newStage) {
      setDragging(null);
      return;
    }

    const stageInfo = STAGES.find((s) => s.stage === newStage);
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dragging
          ? {
              ...d,
              stage: newStage,
              probability: stageInfo?.probability ?? d.probability,
            }
          : d,
      ),
    );

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase
      .from("deals")
      .update({ stage: newStage, probability: stageInfo?.probability })
      .eq("id", dragging);
    await supabase.from("activities").insert({
      type: "deal_stage_changed",
      title: `Deal "${deal.title}" moved to ${newStage}`,
      entity_type: "deal",
      entity_id: dragging,
      deal_id: dragging,
      created_by: user?.id,
    });
    setDragging(null);
  };

  const filteredDeals =
    dateFrom || dateTo
      ? deals.filter((d) => {
          const dateStr = d.expected_close_date || d.created_at;
          const dt = parseISO(dateStr);
          if (dateFrom && dt < startOfDay(new Date(dateFrom))) return false;
          if (dateTo && dt > endOfDay(new Date(dateTo))) return false;
          return true;
        })
      : deals;

  const exportToExcel = () => {
    const headers = [
      "Title",
      "Stage",
      "Value (INR)",
      "Probability",
      "Contact",
      "Company",
      "Expected Close",
      "Created Date",
    ];
    const rows = filteredDeals.map((d) =>
      [
        d.title,
        d.stage,
        d.value,
        `${d.probability}%`,
        d.contact
          ? `${(d.contact as { first_name: string; last_name: string }).first_name} ${(d.contact as { first_name: string; last_name: string }).last_name}`
          : "",
        (d.company as { name: string })?.name ?? "",
        d.expected_close_date ?? "",
        format(parseISO(d.created_at), "yyyy-MM-dd"),
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`),
    );
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `crm_deals_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success(`Exported ${filteredDeals.length} deals`);
  };

  const totalPipeline = deals
    .filter((d) => !["won", "lost"].includes(d.stage))
    .reduce((s, d) => s + (d.value ?? 0), 0);

  const wonValue = deals
    .filter((d) => d.stage === "won")
    .reduce((s, d) => s + (d.value ?? 0), 0);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-5 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-[#0B3C5D]">Deals Pipeline</h1>
          <div className="flex gap-4 text-sm text-gray-500 mt-0.5">
            <span>
              Pipeline:{" "}
              <span className="font-semibold text-[#0B3C5D]">
                ₹{fmt(totalPipeline)}
              </span>
            </span>
            <span>
              Won:{" "}
              <span className="font-semibold text-green-600">
                ₹{fmt(wonValue)}
              </span>
            </span>
          </div>
          {(dateFrom || dateTo) && (
            <p className="text-xs text-[#1ABC9C] mt-0.5">
              · date filtered ({filteredDeals.length} deals)
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
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
              {dateFrom || dateTo ? "Filtered" : "Date"}
            </button>
            {showDateFilter && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-20 w-64">
                <p className="text-xs font-semibold text-[#0B3C5D] mb-3">
                  Filter by expected close date
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
                      className="flex-1 px-3 py-1.5 text-xs bg-[#0B3C5D] text-white rounded-lg"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-colors"
            title="Export to Excel (CSV)"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => openAdd()}
            className="flex items-center gap-2 bg-[#0B3C5D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0B3C5D]/90"
          >
            <Plus className="w-4 h-4" /> Add Deal
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-[#1ABC9C]" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1">
          {STAGES.map(({ stage, label, color, headerColor, probability }) => {
            const stageDeals = deals.filter((d) => d.stage === stage);
            const stageValue = stageDeals.reduce(
              (s, d) => s + (d.value ?? 0),
              0,
            );
            return (
              <div
                key={stage}
                className={`flex-shrink-0 w-64 rounded-xl border ${color} flex flex-col`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(stage, e)}
              >
                {/* Column header */}
                <div
                  className={`${headerColor} text-white rounded-t-xl px-3 py-2.5`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{label}</span>
                    <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/80 mt-0.5">
                    ₹{fmt(stageValue)}
                  </p>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={() => setDragging(deal.id)}
                      onDragEnd={() => setDragging(null)}
                      className={`bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${dragging === deal.id ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <p className="text-xs font-semibold text-[#0B3C5D] leading-snug">
                          {deal.title}
                        </p>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => openEdit(deal)}
                            className="text-gray-300 hover:text-[#0B3C5D] transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(deal.id)}
                            className="text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-[#1ABC9C]">
                        ₹{fmt(deal.value)}
                      </p>
                      {(deal.contact as Contact) && (
                        <p className="text-[10px] text-gray-400 mt-1">
                          👤 {(deal.contact as Contact).first_name}{" "}
                          {(deal.contact as Contact).last_name}
                        </p>
                      )}
                      {(deal.company as Company) && (
                        <p className="text-[10px] text-gray-400">
                          🏢 {(deal.company as Company).name}
                        </p>
                      )}
                      {deal.expected_close_date && (
                        <p className="text-[10px] text-gray-400">
                          📅{" "}
                          {format(
                            parseISO(deal.expected_close_date),
                            "d MMM yyyy",
                          )}
                        </p>
                      )}
                      <div className="mt-2 bg-gray-100 rounded-full h-1">
                        <div
                          className="h-1 rounded-full bg-[#1ABC9C] transition-all"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-gray-400 mt-0.5">
                        {deal.probability}% probability
                      </p>
                    </div>
                  ))}

                  <button
                    onClick={() => openAdd(stage)}
                    className="w-full text-xs text-gray-400 hover:text-[#0B3C5D] border border-dashed border-gray-200 hover:border-[#1ABC9C] rounded-lg p-2 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-base font-semibold text-[#0B3C5D]">
                {editing ? "Edit Deal" : "Add Deal"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Deal Title *
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
                    Value (₹)
                  </label>
                  <input
                    type="number"
                    value={form.value ?? 0}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, value: Number(e.target.value) }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Stage
                  </label>
                  <select
                    value={form.stage ?? "lead"}
                    onChange={(e) => {
                      const s = STAGES.find(
                        (st) => st.stage === e.target.value,
                      );
                      setForm((f) => ({
                        ...f,
                        stage: e.target.value as DealStage,
                        probability: s?.probability ?? f.probability,
                      }));
                    }}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
                  >
                    {STAGES.map((s) => (
                      <option key={s.stage} value={s.stage}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Contact
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
                    Company
                  </label>
                  <select
                    value={form.company_id ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        company_id: e.target.value || undefined,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
                  >
                    <option value="">— None —</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Expected Close Date
                  </label>
                  <input
                    type="date"
                    value={form.expected_close_date ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        expected_close_date: e.target.value || undefined,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Probability (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.probability ?? 10}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        probability: Number(e.target.value),
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
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
                {saving ? "Saving…" : editing ? "Update" : "Create Deal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
