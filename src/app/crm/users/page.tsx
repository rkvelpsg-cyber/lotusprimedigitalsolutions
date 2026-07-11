"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Profile, UserRole } from "@/types/crm";
import { Edit2, Loader2, X, UserCog, Mail, Phone } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

const ROLES: UserRole[] = ["admin", "manager", "agent"];
const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-700",
  manager: "bg-blue-100 text-blue-700",
  agent: "bg-gray-100 text-gray-600",
};

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [
      { data: profileData },
      {
        data: { user },
      },
    ] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at"),
      supabase.auth.getUser(),
    ]);
    setUsers((profileData ?? []) as Profile[]);
    const me = profileData?.find((p: Profile) => p.id === user?.id) ?? null;
    setCurrentUser(me as Profile | null);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openEdit = (u: Profile) => {
    if (currentUser?.role !== "admin" && currentUser?.id !== u.id) {
      toast.error("Only admins can edit other users");
      return;
    }
    setEditing(u);
    setForm(u);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    const payload: Record<string, unknown> = {
      full_name: form.full_name || null,
      phone: form.phone || null,
      role: form.role ?? editing.role,
    };
    const { error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", editing.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated");
      setShowModal(false);
      load();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#0B3C5D]">Team Members</h1>
        <p className="text-sm text-gray-500">
          {users.length} users · Manage via Supabase Dashboard → Authentication
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-[#1ABC9C]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow ${user.id === currentUser?.id ? "border-[#1ABC9C]/30" : "border-gray-100"}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0B3C5D] to-[#1ABC9C] flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {(user.full_name ?? user.email ?? "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0B3C5D] text-sm">
                      {user.full_name ?? "Unnamed User"}
                      {user.id === currentUser?.id && (
                        <span className="ml-1 text-[10px] text-[#1ABC9C]">
                          (you)
                        </span>
                      )}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${ROLE_COLORS[user.role]}`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => openEdit(user)}
                  className="p-1.5 text-gray-400 hover:text-[#0B3C5D] hover:bg-gray-100 rounded"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500">
                {user.email && (
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </p>
                )}
                {user.phone && (
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {user.phone}
                  </p>
                )}
                <p className="text-gray-300">
                  Joined {format(parseISO(user.created_at), "d MMM yyyy")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
        <p className="font-medium mb-1">💡 To invite new team members:</p>
        <p className="text-xs text-blue-600">
          Go to your{" "}
          <strong>
            Supabase Dashboard → Authentication → Users → Invite user
          </strong>
          . Their profile will be automatically created on first sign-in.
        </p>
      </div>

      {showModal && editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-base font-semibold text-[#0B3C5D]">
                Edit Profile
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  value={form.full_name ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, full_name: e.target.value }))
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
              {currentUser?.role === "admin" && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Role
                  </label>
                  <select
                    value={form.role ?? editing.role}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        role: e.target.value as UserRole,
                      }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1ABC9C] bg-white"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
