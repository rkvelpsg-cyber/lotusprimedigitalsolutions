"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Lead, LeadStatus, LeadSource } from "@/types/crm";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Loader2,
  ChevronUp,
  ChevronDown,
  X,
  Phone,
  Mail,
  ArrowRightCircle,
  StickyNote,
  Calendar,
  Download,
} from "lucide-react";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  qualified: "bg-green-100 text-green-700",
  unqualified: "bg-red-100 text-red-700",
  converted: "bg-purple-100 text-purple-700",
};

const STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "unqualified",
  "converted",
];
const SOURCES: LeadSource[] = [
  "website",
  "referral",
  "social_media",
  "cold_call",
  "email",
  "event",
  "other",
];

type FormState = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  source: LeadSource | "";
  status: LeadStatus;
  estimated_value: number | "";
  description: string;
};
const EMPTY: FormState = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  company: "",
  title: "",
  source: "",
  status: "new",
  estimated_value: "",
  description: "",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "">("");
  const [showModal, setShowModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [noteText, setNoteText] = useState("");
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [sortField, setSortField] = useState<
    "created_at" | "first_name" | "estimated_value" | "status"
  >("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let q = supabase
      .from("leads")
      .select("*")
      .order(sortField, { ascending: sortDir === "asc" });
    if (filterStatus) q = q.eq("status", filterStatus);
    const { data, error } = await q;
    if (error) toast.error(error.message);
    else setLeads((data ?? []) as Lead[]);
    setLoading(false);
  }, [sortField, sortDir, filterStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowModal(true);
  };
  const openEdit = (l: Lead) => {
    setEditing(l);
    setForm({
      first_name: l.first_name,
      last_name: l.last_name,
      email: l.email ?? "",
      phone: l.phone ?? "",
      company: l.company ?? "",
      title: l.title ?? "",
      source: l.source ?? "",
      status: l.status,
      estimated_value: l.estimated_value ?? "",
      description: l.description ?? "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.first_name || !form.last_name) {
      toast.error("First and last name are required");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    // Explicit payload — never spread join objects
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email || null,
      phone: form.phone || null,
      company: form.company || null,
      title: form.title || null,
      source: (form.source || null) as LeadSource | null,
      status: form.status,
      estimated_value:
        form.estimated_value !== "" ? Number(form.estimated_value) : null,
      description: form.description || null,
      created_by: user?.id ?? null,
    };

    const { data: saved, error } = editing
      ? await supabase
          .from("leads")
          .update(payload)
          .eq("id", editing.id)
          .select()
          .single()
      : await supabase.from("leads").insert(payload).select().single();

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(editing ? "Lead updated" : "Lead created");
      setShowModal(false);
      if (user && saved) {
        await supabase.from("activities").insert({
          type: editing ? "lead_updated" : "lead_created",
          title: `${editing ? "Lead updated" : "New lead"}: ${payload.first_name} ${payload.last_name}`,
          entity_type: "lead",
          entity_id: saved.id,
          lead_id: saved.id,
          created_by: user.id,
        });
      }
      load();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Lead deleted");
      load();
    }
  };

  // Convert lead → Contact
  const handleConvert = async (lead: Lead) => {
    if (
      !confirm(`Convert "${lead.first_name} ${lead.last_name}" to a Contact?`)
    )
      return;
    setConverting(lead.id);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: contact, error: cErr } = await supabase
      .from("contacts")
      .insert({
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        title: lead.title,
        source: lead.source,
        status: "active",
        description: lead.description,
        created_by: user?.id ?? null,
      })
      .select()
      .single();
    if (cErr) {
      toast.error("Failed: " + cErr.message);
      setConverting(null);
      return;
    }
    await supabase
      .from("leads")
      .update({
        status: "converted",
        converted_at: new Date().toISOString(),
        converted_contact_id: contact.id,
      })
      .eq("id", lead.id);
    if (user) {
      await supabase.from("activities").insert({
        type: "lead_converted",
        title: `Lead converted to Contact: ${lead.first_name} ${lead.last_name}`,
        entity_type: "contact",
        entity_id: contact.id,
        lead_id: lead.id,
        contact_id: contact.id,
        created_by: user.id,
      });
    }
    toast.success(`${lead.first_name} converted to Contact!`);
    setConverting(null);
    load();
  };

  // Add note to a lead
  const handleAddNote = async () => {
    if (!noteText.trim() || !selectedLead) return;
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from("notes").insert({
      content: noteText.trim(),
      lead_id: selectedLead.id,
      created_by: user?.id ?? null,
    });
    if (error) {
      toast.error(error.message);
    } else {
      await supabase.from("activities").insert({
        type: "note_added",
        title: `Note on lead: ${selectedLead.first_name} ${selectedLead.last_name}`,
        entity_type: "lead",
        entity_id: selectedLead.id,
        lead_id: selectedLead.id,
        created_by: user?.id ?? null,
      });
      toast.success("Note saved");
      setNoteText("");
      setShowNoteModal(false);
      setSelectedLead(null);
    }
    setSaving(false);
  };

  const sort = (
    field: "created_at" | "first_name" | "estimated_value" | "status",
  ) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = leads.filter((l) => {
    const text = `${l.first_name} ${l.last_name} ${l.email ?? ""} ${l.company ?? ""}`;
    if (!text.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateFrom || dateTo) {
      const d = parseISO(l.created_at);
      if (dateFrom && d < startOfDay(new Date(dateFrom))) return false;
      if (dateTo && d > endOfDay(new Date(dateTo))) return false;
    }
    return true;
  });

  const exportToExcel = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Company",
      "Status",
      "Source",
      "Estimated Value",
      "Created Date",
    ];
    const rows = filtered.map((l) =>
      [
        l.first_name,
        l.last_name,
        l.email ?? "",
        l.phone ?? "",
        l.company ?? "",
        l.status,
        l.source ?? "",
        l.estimated_value ?? "",
        format(parseISO(l.created_at), "yyyy-MM-dd"),
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`),
    );
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `crm_leads_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success(`Exported ${filtered.length} leads`);
  };

  const SortIcon = ({ field }: { field: keyof Lead }) =>
    sortField === field ? (
      sortDir === "asc" ? (
        <ChevronUp className="w-3 h-3" />
      ) : (
        <ChevronDown className="w-3 h-3" />
      )
    ) : (
      <ChevronUp className="w-3 h-3 opacity-0 group-hover:opacity-30" />
    );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0B3C5D]">Leads</h1>
          <p className="text-sm text-gray-500">
            {filtered.length} records
            {(dateFrom || dateTo) && (
              <span className="ml-2 text-[#1ABC9C]">· date filtered</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date filter */}
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
                  Filter by created date
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
          {/* Export */}
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-colors"
            title="Export to Excel (CSV)"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#0B3C5D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0B3C5D]/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads…"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1ABC9C]"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as LeadStatus | "")}
            className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
          >
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-[#1ABC9C]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-sm">
            No leads found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    ["Name", "first_name"],
                    ["Company", "company"],
                    ["Status", "status"],
                    ["Source", "source"],
                    ["Value (₹)", "estimated_value"],
                    ["Created", "created_at"],
                  ].map(([label, field]) => (
                    <th
                      key={field}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 cursor-pointer hover:text-[#0B3C5D] group"
                      onClick={() =>
                        sort(
                          field as
                            | "created_at"
                            | "first_name"
                            | "estimated_value"
                            | "status",
                        )
                      }
                    >
                      <span className="flex items-center gap-1">
                        {label}{" "}
                        <SortIcon
                          field={
                            field as
                              | "created_at"
                              | "first_name"
                              | "estimated_value"
                              | "status"
                          }
                        />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-[#0B3C5D]">
                          {lead.first_name} {lead.last_name}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          {lead.email && (
                            <>
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </>
                          )}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {lead.company ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">
                      {lead.source?.replace(/_/g, " ") ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {lead.estimated_value
                        ? `₹${lead.estimated_value.toLocaleString("en-IN")}`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {format(parseISO(lead.created_at), "d MMM yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {lead.status !== "converted" && (
                          <button
                            onClick={() => handleConvert(lead)}
                            disabled={converting === lead.id}
                            title="Convert to Contact"
                            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          >
                            {converting === lead.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ArrowRightCircle className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedLead(lead);
                            setNoteText("");
                            setShowNoteModal(true);
                          }}
                          title="Add Note"
                          className="p-1.5 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                        >
                          <StickyNote className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEdit(lead)}
                          className="p-1.5 text-gray-400 hover:text-[#0B3C5D] hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-base font-semibold text-[#0B3C5D]">
                {editing ? "Edit Lead" : "Add New Lead"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    First Name *
                  </label>
                  <input
                    value={form.first_name ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, first_name: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Last Name *
                  </label>
                  <input
                    value={form.last_name ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, last_name: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <input
                    value={form.phone ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Company
                  </label>
                  <input
                    value={form.company ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, company: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Title
                  </label>
                  <input
                    value={form.title ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status ?? "new"}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as LeadStatus,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Source
                  </label>
                  <select
                    value={form.source ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        source: (e.target.value as LeadSource) || undefined,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
                  >
                    <option value="">Select source</option>
                    {SOURCES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Estimated Value (₹)
                </label>
                <input
                  type="number"
                  value={form.estimated_value ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      estimated_value: e.target.value
                        ? Number(e.target.value)
                        : ("" as const),
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Notes
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
                {saving ? "Saving…" : editing ? "Update Lead" : "Create Lead"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Note Modal */}
      {showNoteModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-base font-semibold text-[#0B3C5D]">
                Add Note — {selectedLead.first_name} {selectedLead.last_name}
              </h2>
              <button onClick={() => setShowNoteModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <textarea
                rows={5}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Type your note here…"
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={saving || !noteText.trim()}
                className="px-4 py-2 text-sm bg-[#0B3C5D] text-white rounded-lg hover:bg-[#0B3C5D]/90 disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
