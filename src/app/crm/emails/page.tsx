"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Email, EmailStatus, Contact, Deal } from "@/types/crm";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  X,
  Mail,
  Send,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

const STATUS_COLORS: Record<EmailStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  sent: "bg-blue-100 text-blue-700",
  received: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

const EMPTY: Partial<Email> = {
  subject: "",
  body: "",
  from_email: "",
  to_email: "",
  cc: "",
  status: "draft",
  contact_id: undefined,
  deal_id: undefined,
};

export default function EmailsPage() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Email | null>(null);
  const [form, setForm] = useState<Partial<Email>>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: emailData }, { data: contactData }, { data: dealData }] =
      await Promise.all([
        supabase
          .from("emails")
          .select("*, contact:contact_id(id,first_name,last_name,email)")
          .order("created_at", { ascending: false }),
        supabase
          .from("contacts")
          .select("id,first_name,last_name,email")
          .order("first_name"),
        supabase.from("deals").select("id,title").order("title"),
      ]);
    setEmails((emailData ?? []) as Email[]);
    setContacts((contactData ?? []) as Contact[]);
    setDeals((dealData ?? []) as Deal[]);
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
  const openEdit = (e: Email) => {
    setEditing(e);
    setForm(e);
    setShowModal(true);
  };

  const handleSave = async (markSent = false) => {
    if (!form.subject || !form.from_email || !form.to_email) {
      toast.error("Subject, from, and to are required");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const payload: Record<string, unknown> = {
      subject: form.subject,
      body: form.body || null,
      from_email: form.from_email,
      to_email: form.to_email,
      cc: form.cc || null,
      status: markSent ? "sent" : (form.status ?? "draft"),
      contact_id: form.contact_id || null,
      deal_id: form.deal_id || null,
      sent_at: markSent ? new Date().toISOString() : null,
      created_by: user?.id,
    };
    const { error } = editing
      ? await supabase.from("emails").update(payload).eq("id", editing.id)
      : await supabase.from("emails").insert(payload);

    if (error) toast.error(error.message);
    else {
      toast.success(
        markSent
          ? "Email marked as sent"
          : editing
            ? "Email updated"
            : "Email saved",
      );
      setShowModal(false);
      load();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this email record?")) return;
    const supabase = createClient();
    await supabase.from("emails").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const filtered = emails.filter((e) =>
    `${e.subject} ${e.to_email} ${e.from_email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0B3C5D]">Emails</h1>
          <p className="text-sm text-gray-500">{filtered.length} records</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#0B3C5D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0B3C5D]/90"
        >
          <Plus className="w-4 h-4" /> Log Email
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emails…"
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1ABC9C]"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-6 h-6 animate-spin text-[#1ABC9C]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-sm">
            No email records found
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((email) => (
              <div
                key={email.id}
                className="flex items-start gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#0B3C5D] truncate">
                    {email.subject}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    To: {email.to_email}
                    {email.cc ? ` · CC: ${email.cc}` : ""}
                  </p>
                  {email.body && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {email.body}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-300 mt-1">
                    {format(parseISO(email.created_at), "d MMM yyyy, h:mm a")}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS[email.status]}`}
                  >
                    {email.status}
                  </span>
                  <button
                    onClick={() => openEdit(email)}
                    className="p-1.5 text-gray-400 hover:text-[#0B3C5D] hover:bg-gray-100 rounded"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(email.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-base font-semibold text-[#0B3C5D]">
                {editing ? "Edit Email" : "Log Email"}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Subject *
                </label>
                <input
                  value={form.subject ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, subject: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    From *
                  </label>
                  <input
                    type="email"
                    value={form.from_email ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, from_email: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    To *
                  </label>
                  <input
                    type="email"
                    value={form.to_email ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, to_email: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  CC
                </label>
                <input
                  value={form.cc ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cc: e.target.value }))
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
                  Body
                </label>
                <textarea
                  rows={5}
                  value={form.body ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, body: e.target.value }))
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
                onClick={() => handleSave(false)}
                disabled={saving}
                className="px-4 py-2 text-sm border border-[#0B3C5D] text-[#0B3C5D] rounded-lg hover:bg-[#0B3C5D]/5 disabled:opacity-60"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="px-4 py-2 text-sm bg-[#0B3C5D] text-white rounded-lg hover:bg-[#0B3C5D]/90 disabled:opacity-60 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <Send className="w-3.5 h-3.5" />
                Mark Sent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
