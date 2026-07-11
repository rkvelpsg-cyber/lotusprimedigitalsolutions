"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { Profile } from "@/types/crm";
import {
  LayoutDashboard,
  Users,
  Building2,
  Handshake,
  CheckSquare,
  Activity,
  Mail,
  UserCog,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Target,
} from "lucide-react";

const NAV = [
  { href: "/crm", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crm/leads", label: "Leads", icon: Target },
  { href: "/crm/contacts", label: "Contacts", icon: Users },
  { href: "/crm/companies", label: "Companies", icon: Building2 },
  { href: "/crm/deals", label: "Deals", icon: Handshake },
  { href: "/crm/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/crm/activities", label: "Activities", icon: Activity },
  { href: "/crm/emails", label: "Emails", icon: Mail },
  { href: "/crm/users", label: "Users", icon: UserCog },
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadProfile = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/crm/login");
      return;
    }

    // Ensure a profile row exists for this user (handles users created before the trigger)
    await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email ?? null,
        full_name:
          user.user_metadata?.full_name ??
          (user.email ? user.email.split("@")[0] : "User"),
      },
      { onConflict: "id", ignoreDuplicates: true },
    );

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (data) setProfile(data as Profile);
  }, [router]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/crm/login");
  };

  if (pathname === "/crm/login") return <>{children}</>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#0B3C5D] flex flex-col transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <Link href="/crm" className="flex items-center gap-3">
            <div className="bg-white rounded-lg p-1.5">
              <img
                src="/LP%20Logo%20Vector.svg"
                alt="LP"
                className="h-7 w-auto"
              />
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-tight">
                LOTUS PRIME
              </p>
              <p className="text-[#1ABC9C] text-[10px] leading-tight">
                CRM Portal
              </p>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/crm" ? pathname === "/crm" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-[#1ABC9C] text-white shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-4">
          {profile && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#1ABC9C] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(profile.full_name ?? profile.email ?? "U")[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">
                  {profile.full_name ?? "User"}
                </p>
                <p className="text-white/50 text-[10px] truncate">
                  {profile.role}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/60 hover:text-red-400 text-xs transition-colors w-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ───────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center gap-4 px-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-[#0B3C5D] transition-colors"
          >
            ← Back to website
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
