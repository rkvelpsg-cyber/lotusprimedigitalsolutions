"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Activity } from "@/types/crm";
import { Loader2, RefreshCw } from "lucide-react";
import { format, parseISO, formatDistanceToNow } from "date-fns";

const TYPE_ICONS: Record<string, string> = {
  lead_created: "🎯",
  lead_updated: "✏️",
  lead_converted: "🔄",
  contact_created: "👤",
  contact_updated: "✏️",
  company_created: "🏢",
  company_updated: "✏️",
  deal_created: "💼",
  deal_stage_changed: "📊",
  deal_won: "🏆",
  deal_lost: "❌",
  task_created: "✅",
  task_completed: "🎉",
  note_added: "📝",
  email_sent: "📧",
  call_logged: "📞",
  meeting_logged: "🤝",
};

const TYPE_COLORS: Record<string, string> = {
  deal_won: "border-green-200 bg-green-50",
  deal_lost: "border-red-200 bg-red-50",
  task_completed: "border-teal-200 bg-teal-50",
  default: "border-gray-100 bg-white",
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 30;

  const load = useCallback(
    async (reset = false) => {
      setLoading(true);
      const supabase = createClient();
      const from = reset ? 0 : page * PAGE_SIZE;
      const { data } = await supabase
        .from("activities")
        .select("*, author:created_by(full_name,email)")
        .order("created_at", { ascending: false })
        .range(from, from + PAGE_SIZE - 1);

      const rows = (data ?? []) as Activity[];
      if (reset) {
        setActivities(rows);
        setPage(0);
      } else setActivities((prev) => [...prev, ...rows]);
      setHasMore(rows.length === PAGE_SIZE);
      setLoading(false);
    },
    [page],
  );

  useEffect(() => {
    load(true);
  }, []);

  const loadMore = () => {
    setPage((p) => p + 1);
    load();
  };

  // Group by date
  const grouped: Record<string, Activity[]> = {};
  activities.forEach((a) => {
    const day = format(parseISO(a.created_at), "yyyy-MM-dd");
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(a);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0B3C5D]">Activity Log</h1>
          <p className="text-sm text-gray-500">{activities.length} events</p>
        </div>
        <button
          onClick={() => load(true)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#0B3C5D] border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading && activities.length === 0 ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-[#1ABC9C]" />
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center text-gray-400 py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-4xl mb-3">📋</p>
          <p>No activity yet. Start adding leads, contacts, and deals!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([day, acts]) => (
            <div key={day}>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs font-semibold text-gray-400 px-2">
                  {format(parseISO(day), "EEEE, d MMMM yyyy")}
                </span>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <div className="space-y-2">
                {acts.map((act) => {
                  const colorClass =
                    TYPE_COLORS[act.type] ?? TYPE_COLORS.default;
                  return (
                    <div
                      key={act.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border ${colorClass} hover:shadow-sm transition-shadow`}
                    >
                      <span className="text-xl flex-shrink-0 leading-none mt-0.5">
                        {TYPE_ICONS[act.type] ?? "📌"}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          {act.title}
                        </p>
                        {act.description && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {act.description}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-400 mt-1">
                          {format(parseISO(act.created_at), "h:mm a")}
                          {" · "}
                          {formatDistanceToNow(parseISO(act.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 mt-1 capitalize">
                        {act.entity_type ?? ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-60 flex items-center gap-2 mx-auto"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Load more
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
