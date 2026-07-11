"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Company, CompanySize } from "@/types/crm";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  X,
  Globe,
  Building2,
  Calendar,
  Download,
} from "lucide-react";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";
import { toast } from "sonner";

const SIZES: CompanySize[] = ["1-10", "11-50", "51-200", "201-500", "500+"];
const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Finance",
  "Real Estate",
  "Hospitality",
  "Logistics",
  "Other",
];

const EMPTY: Partial<Company> = {
  name: "",
  website: "",
  industry: "",
  size: undefined,
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  annual_revenue: undefined,
  description: "",
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState<Partial<Company>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("companies").select("*").order("name");
    setCompanies((data ?? []) as Company[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowModal(true);
  };
  const openEdit = (c: Company) => {
    setEditing(c);
    setForm({
      name: c.name,
      website: c.website ?? "",
      industry: c.industry ?? "",
      size: c.size ?? undefined,
      phone: c.phone ?? "",
      email: c.email ?? "",
      address: c.address ?? "",
      city: c.city ?? "",
      state: c.state ?? "",
      country: c.country ?? "India",
      annual_revenue: c.annual_revenue ?? undefined,
      description: c.description ?? "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) {
      toast.error("Company name is required");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const payload: Record<string, unknown> = {
      name: form.name,
      website: form.website || null,
      industry: form.industry || null,
      size: form.size || null,
      phone: form.phone || null,
      email: form.email || null,
      address: form.address || null,
      city: form.city || null,
      state: form.state || null,
      country: form.country || "India",
      annual_revenue: form.annual_revenue || null,
      description: form.description || null,
      created_by: user?.id,
    };
    const { data: saved, error } = editing
      ? await supabase
          .from("companies")
          .update(payload)
          .eq("id", editing.id)
          .select()
          .single()
      : await supabase.from("companies").insert(payload).select().single();

    if (error) toast.error(error.message);
    else {
      toast.success(editing ? "Company updated" : "Company created");
      setShowModal(false);
      if (user && saved) {
        await supabase.from("activities").insert({
          type: editing ? "company_updated" : "company_created",
          title: `${editing ? "Company updated" : "New company"}: ${payload.name}`,
          entity_type: "company",
          entity_id: saved.id,
          company_id: saved.id,
          created_by: user.id,
        });
      }
      load();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Delete this company? Related contacts and deals will have no company.",
      )
    )
      return;
    const supabase = createClient();
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Company deleted");
      load();
    }
  };

  const filtered = companies.filter((c) => {
    const text = `${c.name} ${c.industry ?? ""} ${c.city ?? ""}`;
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
      "Company Name",
      "Industry",
      "City",
      "State",
      "Phone",
      "Email",
      "Website",
      "Annual Revenue",
      "Created Date",
    ];
    const rows = filtered.map((c) =>
      [
        c.name,
        c.industry ?? "",
        c.city ?? "",
        c.state ?? "",
        c.phone ?? "",
        c.email ?? "",
        c.website ?? "",
        c.annual_revenue ?? "",
        format(parseISO(c.created_at), "yyyy-MM-dd"),
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`),
    );
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `crm_companies_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.success(`Exported ${filtered.length} companies`);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0B3C5D]">Companies</h1>
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
            <Plus className="w-4 h-4" /> Add Company
          </button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies…"
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1ABC9C]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-[#1ABC9C]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-16 text-sm">
              No companies found
            </div>
          ) : (
            filtered.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-[#1ABC9C]/20 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-[#0B3C5D]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-[#0B3C5D]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0B3C5D] text-sm leading-tight">
                        {company.name}
                      </h3>
                      {company.industry && (
                        <p className="text-xs text-gray-400">
                          {company.industry}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEdit(company)}
                      className="p-1.5 text-gray-400 hover:text-[#0B3C5D] hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-gray-500">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:text-[#1ABC9C] transition-colors"
                    >
                      <Globe className="w-3 h-3" />
                      {company.website.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                  {company.city && (
                    <p>
                      📍 {company.city}
                      {company.state ? `, ${company.state}` : ""}
                    </p>
                  )}
                  {company.size && <p>👥 {company.size} employees</p>}
                  {company.annual_revenue && (
                    <p>
                      💰 ₹{company.annual_revenue.toLocaleString("en-IN")}{" "}
                      revenue
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-300 mt-3">
                  Added {format(parseISO(company.created_at), "d MMM yyyy")}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-base font-semibold text-[#0B3C5D]">
                {editing ? "Edit Company" : "Add Company"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Company Name *
                </label>
                <input
                  value={form.name ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Industry
                  </label>
                  <select
                    value={form.industry ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        industry: e.target.value || undefined,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Company Size
                  </label>
                  <select
                    value={form.size ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        size: (e.target.value as CompanySize) || undefined,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
                  >
                    <option value="">Select size</option>
                    {SIZES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Website
                </label>
                <input
                  value={form.website ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, website: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  placeholder="https://"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    City
                  </label>
                  <input
                    value={form.city ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, city: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    State
                  </label>
                  <input
                    value={form.state ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, state: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Country
                  </label>
                  <input
                    value={form.country ?? "India"}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, country: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Annual Revenue (₹)
                </label>
                <input
                  type="number"
                  value={form.annual_revenue ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      annual_revenue: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                />
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
                {saving ? "Saving…" : editing ? "Update" : "Create Company"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
