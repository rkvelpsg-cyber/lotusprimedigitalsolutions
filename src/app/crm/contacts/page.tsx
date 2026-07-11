"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Contact, Company, LeadSource } from "@/types/crm";
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Loader2,
  X,
  Mail,
  Phone,
  Building2,
  Calendar,
  Download,
} from "lucide-react";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";

const SOURCES: LeadSource[] = [
  "website",
  "referral",
  "social_media",
  "cold_call",
  "email",
  "event",
  "other",
];

const EMPTY: Partial<Contact> = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  title: "",
  company_id: undefined,
  status: "active",
  source: undefined,
  description: "",
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"active" | "inactive" | "">(
    "",
  );
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState<Partial<Contact>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let q = supabase
      .from("contacts")
      .select("*, company:company_id(id,name), assignee:assigned_to(full_name)")
      .order("created_at", { ascending: false });
    if (filterStatus) q = q.eq("status", filterStatus);
    const [{ data: contactData }, { data: companyData }] = await Promise.all([
      q,
      supabase.from("companies").select("id,name").order("name"),
    ]);
    setContacts((contactData ?? []) as Contact[]);
    setCompanies((companyData ?? []) as Company[]);
    setLoading(false);
  }, [filterStatus]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowModal(true);
  };
  const openEdit = (c: Contact) => {
    setEditing(c);
    setForm({
      first_name: c.first_name,
      last_name: c.last_name,
      email: c.email ?? "",
      phone: c.phone ?? "",
      title: c.title ?? "",
      company_id: c.company_id ?? undefined,
      status: c.status,
      source: c.source ?? undefined,
      description: c.description ?? "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.first_name || !form.last_name) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const payload: Record<string, unknown> = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email || null,
      phone: form.phone || null,
      title: form.title || null,
      company_id: form.company_id || null,
      status: form.status ?? "active",
      source: form.source || null,
      description: form.description || null,
      created_by: user?.id,
    };

    const { data: saved, error } = editing
      ? await supabase
          .from("contacts")
          .update(payload)
          .eq("id", editing.id)
          .select()
          .single()
      : await supabase.from("contacts").insert(payload).select().single();

    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Contact updated" : "Contact created");
      setShowModal(false);
      if (user && saved) {
        await supabase.from("activities").insert({
          type: editing ? "contact_updated" : "contact_created",
          title: `${editing ? "Contact updated" : "New contact"}: ${payload.first_name} ${payload.last_name}`,
          entity_type: "contact",
          entity_id: saved.id,
          contact_id: saved.id,
          created_by: user.id,
        });
      }
      load();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Contact deleted");
      load();
    }
  };

  const filtered = contacts.filter((c) => {
    const text = `${c.first_name} ${c.last_name} ${c.email ?? ""} ${(c.company as Company)?.name ?? ""}`;
    if (!text.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateFrom || dateTo) {
      const d = parseISO(c.created_at);
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
      "Title",
      "Company",
      "Status",
      "Source",
      "Created Date",
    ];
    const rows = filtered.map((c) =>
      [
        c.first_name,
        c.last_name,
        c.email ?? "",
        c.phone ?? "",
        c.title ?? "",
        (c.company as Company)?.name ?? "",
        c.status,
        c.source ?? "",
        format(parseISO(c.created_at), "yyyy-MM-dd"),
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`),
    );
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `crm_contacts_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success(`Exported ${filtered.length} contacts`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0B3C5D]">Contacts</h1>
          <p className="text-sm text-gray-500">
            {filtered.length} records
            {(dateFrom || dateTo) && (
              <span className="ml-2 text-[#1ABC9C]">· date filtered</span>
            )}
          </p>
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
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-colors"
            title="Export to Excel (CSV)"
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#0B3C5D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0B3C5D]/90"
          >
            <Plus className="w-4 h-4" /> Add Contact
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts…"
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1ABC9C]"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) =>
            setFilterStatus(e.target.value as "active" | "inactive" | "")
          }
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-[#1ABC9C]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-sm">
            No contacts found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    "Name",
                    "Company",
                    "Email",
                    "Phone",
                    "Source",
                    "Status",
                    "Created",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((contact) => (
                  <tr
                    key={contact.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#0B3C5D]">
                        {contact.first_name} {contact.last_name}
                      </p>
                      {contact.title && (
                        <p className="text-xs text-gray-400">{contact.title}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {(contact.company as Company)?.name ? (
                        <span className="flex items-center gap-1 text-gray-600">
                          <Building2 className="w-3 h-3" />
                          {(contact.company as Company).name}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {contact.email ? (
                        <a
                          href={`mailto:${contact.email}`}
                          className="flex items-center gap-1 hover:text-[#1ABC9C]"
                        >
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {contact.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">
                      {contact.source?.replace(/_/g, " ") ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${contact.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {format(parseISO(contact.created_at), "d MMM yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(contact)}
                          className="p-1.5 text-gray-400 hover:text-[#0B3C5D] hover:bg-gray-100 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
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

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-base font-semibold text-[#0B3C5D]">
                {editing ? "Edit Contact" : "Add Contact"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
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
                    Title / Role
                  </label>
                  <input
                    value={form.title ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <select
                    value={form.status ?? "active"}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        status: e.target.value as "active" | "inactive",
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                    <option value="">— No company —</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
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
                {saving ? "Saving…" : editing ? "Update" : "Create Contact"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
