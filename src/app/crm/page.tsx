"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { CRMStats, Activity, Task, Deal } from "@/types/crm";
import {
  Target,
  Users,
  Building2,
  TrendingUp,
  CheckSquare,
  AlertCircle,
  IndianRupee,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, isToday, isPast, parseISO } from "date-fns";

const STAGE_COLORS: Record<string, string> = {
  lead: "#64748b",
  qualified: "#3b82f6",
  proposal: "#f59e0b",
  negotiation: "#8b5cf6",
  won: "#10b981",
  lost: "#ef4444",
};

export default function CRMDashboard() {
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [dealsData, setDealsData] = useState<
    { stage: string; count: number; value: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const supabase = createClient();
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).toISOString();
    const todayEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    ).toISOString();

    const [
      { count: totalLeads },
      { count: totalContacts },
      { count: totalCompanies },
      { data: openDeals },
      { data: wonDeals },
      { count: tasksDueToday },
      { count: tasksOverdue },
      { data: activities },
      { data: tasks },
      { data: allDeals },
    ] = await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("contacts").select("*", { count: "exact", head: true }),
      supabase.from("companies").select("*", { count: "exact", head: true }),
      supabase
        .from("deals")
        .select("value")
        .not("stage", "in", '("won","lost")'),
      supabase.from("deals").select("value").eq("stage", "won"),
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
        .gte("due_date", todayStart)
        .lt("due_date", todayEnd),
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
        .lt("due_date", todayStart),
      supabase
        .from("activities")
        .select("*, author:created_by(full_name,email)")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("tasks")
        .select("*, contact:contact_id(first_name,last_name)")
        .eq("status", "pending")
        .order("due_date", { ascending: true })
        .limit(5),
      supabase.from("deals").select("stage,value").not("stage", "eq", "lost"),
    ]);

    setStats({
      totalLeads: totalLeads ?? 0,
      totalContacts: totalContacts ?? 0,
      totalCompanies: totalCompanies ?? 0,
      openDealsCount: openDeals?.length ?? 0,
      openDealsValue: openDeals?.reduce((s, d) => s + (d.value ?? 0), 0) ?? 0,
      wonDealsValue: wonDeals?.reduce((s, d) => s + (d.value ?? 0), 0) ?? 0,
      tasksDueToday: tasksDueToday ?? 0,
      tasksOverdue: tasksOverdue ?? 0,
    });

    setRecentActivities((activities ?? []) as Activity[]);
    setUpcomingTasks((tasks ?? []) as Task[]);

    // aggregate by stage
    const stageMap: Record<string, { count: number; value: number }> = {};
    (allDeals ?? []).forEach((d) => {
      if (!stageMap[d.stage]) stageMap[d.stage] = { count: 0, value: 0 };
      stageMap[d.stage].count++;
      stageMap[d.stage].value += d.value ?? 0;
    });
    setDealsData(
      Object.entries(stageMap).map(([stage, v]) => ({
        stage: stage.charAt(0).toUpperCase() + stage.slice(1),
        ...v,
      })),
    );

    setLoading(false);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  // Map activity entity_type to CRM route
  const entityHref = (act: Activity): string => {
    const map: Record<string, string> = {
      lead: "/crm/leads",
      contact: "/crm/contacts",
      company: "/crm/companies",
      deal: "/crm/deals",
      task: "/crm/tasks",
    };
    return (act.entity_type && map[act.entity_type]) ?? "/crm/activities";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#1ABC9C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Leads",
      value: stats!.totalLeads,
      icon: Target,
      color: "bg-blue-50 text-blue-600",
      href: "/crm/leads",
    },
    {
      label: "Contacts",
      value: stats!.totalContacts,
      icon: Users,
      color: "bg-green-50 text-green-600",
      href: "/crm/contacts",
    },
    {
      label: "Companies",
      value: stats!.totalCompanies,
      icon: Building2,
      color: "bg-purple-50 text-purple-600",
      href: "/crm/companies",
    },
    {
      label: "Open Deals",
      value: `₹${fmt(stats!.openDealsValue)}`,
      sub: `${stats!.openDealsCount} active deals`,
      icon: TrendingUp,
      color: "bg-teal-50 text-teal-600",
      href: "/crm/deals",
    },
    {
      label: "Won Deals",
      value: `₹${fmt(stats!.wonDealsValue)}`,
      sub: "total won revenue",
      icon: IndianRupee,
      color: "bg-emerald-50 text-emerald-600",
      href: "/crm/deals",
    },
    {
      label: "Tasks Due Today",
      value: stats!.tasksDueToday,
      icon: CheckSquare,
      color: "bg-yellow-50 text-yellow-600",
      href: "/crm/tasks",
    },
    {
      label: "Overdue Tasks",
      value: stats!.tasksOverdue,
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
      href: "/crm/tasks",
    },
  ];

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-[#0B3C5D]">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {format(new Date(), "EEEE, d MMMM yyyy")}
        </p>
      </div>
      <button
        onClick={loadDashboard}
        className="absolute right-4 top-4 text-xs text-gray-400 hover:text-[#1ABC9C] flex items-center gap-1 transition-colors"
      >
        ↻ Refresh
      </button>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#1ABC9C]/30 transition-all group"
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${card.color}`}
            >
              <card.icon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-bold text-[#0B3C5D]">{card.value}</p>
            {card.sub && <p className="text-xs text-gray-400">{card.sub}</p>}
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              {card.label}
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deals by Stage Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-[#0B3C5D] mb-4">
            Deals Pipeline
          </h2>
          {dealsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={dealsData}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(v: number, name: string) =>
                    name === "value" ? [`₹${fmt(v)}`, "Value"] : [v, "Count"]
                  }
                />
                <Bar
                  dataKey="count"
                  fill="#0B3C5D"
                  radius={[4, 4, 0, 0]}
                  name="count"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-400 text-sm">
              No deals yet
            </div>
          )}
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#0B3C5D]">
              Upcoming Tasks
            </h2>
            <Link
              href="/crm/tasks"
              className="text-xs text-[#1ABC9C] hover:underline"
            >
              View all
            </Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-10">
              No pending tasks
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => {
                const due = task.due_date ? parseISO(task.due_date) : null;
                const overdue = due && isPast(due) && !isToday(due);
                const dueToday = due && isToday(due);
                return (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => (window.location.href = "/crm/tasks")}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        task.priority === "urgent"
                          ? "bg-red-500"
                          : task.priority === "high"
                            ? "bg-orange-500"
                            : task.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {task.title}
                      </p>
                      {due && (
                        <p
                          className={`text-xs mt-0.5 ${
                            overdue
                              ? "text-red-500"
                              : dueToday
                                ? "text-orange-500"
                                : "text-gray-400"
                          }`}
                        >
                          {overdue
                            ? "Overdue · "
                            : dueToday
                              ? "Due today · "
                              : ""}
                          {format(due, "d MMM, h:mm a")}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                        task.priority === "urgent"
                          ? "bg-red-100 text-red-600"
                          : task.priority === "high"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-[#0B3C5D]">
            Recent Activity
          </h2>
          <Link
            href="/crm/activities"
            className="text-xs text-[#1ABC9C] hover:underline"
          >
            View all
          </Link>
        </div>
        {recentActivities.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No recent activity
          </p>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((act) => (
              <Link
                key={act.id}
                href={entityHref(act)}
                className="flex items-start gap-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors group"
              >
                <div className="w-2 h-2 rounded-full bg-[#1ABC9C] mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 group-hover:text-[#0B3C5D] transition-colors">
                    {act.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-gray-400">
                      {format(parseISO(act.created_at), "d MMM, h:mm a")}
                    </p>
                    {act.entity_type && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded capitalize">
                        {act.entity_type}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1ABC9C] flex-shrink-0 mt-0.5 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
