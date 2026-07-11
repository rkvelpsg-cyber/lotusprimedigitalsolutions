"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  User,
  Clock,
  Calendar,
  Umbrella,
  Users,
  FileText,
  Video,
  BookOpen,
  TrendingUp,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Building2,
  X,
  Search,
  Sun,
  Moon,
  Menu,
  Zap,
  Plus,
  ChevronDown,
  Send,
  Bot,
  Sparkles,
  RefreshCw,
  Paperclip,
  MessageSquare,
  MoreHorizontal,
  ArrowUpRight,
  Save,
  MapPin,
  Wifi,
  CheckCircle,
  Download,
  Eye,
  FolderOpen,
  Shield,
  Code2,
  Bug,
  Palette,
  GitBranch,
  GitPullRequest,
  DollarSign,
  UserPlus,
  Package,
  Edit2,
  Trash2,
  Instagram,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────
type ActivePage =
  | "dashboard"
  | "projects"
  | "tasks"
  | "my-work"
  | "timesheet"
  | "attendance"
  | "leave"
  | "clients"
  | "documents"
  | "meetings"
  | "learning"
  | "performance"
  | "notifications"
  | "settings"
  | "admin"
  | "ai-assistant"
  | "role-dashboard";

// ─── CSS variables ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  :root {
    --background:#f0f4f8; --foreground:#0f1729;
    --card:#ffffff; --card-foreground:#0f1729;
    --primary:#2563eb; --primary-foreground:#ffffff;
    --secondary:#e2e8f0; --secondary-foreground:#1e2a4a;
    --muted:#e8edf5; --muted-foreground:#64748b;
    --accent:#eff6ff; --accent-foreground:#1d4ed8;
    --destructive:#dc2626;
    --border:rgba(15,23,41,.10);
    --input-background:#f1f5f9;
    --ring:#2563eb;
    --sidebar:#0f1729; --sidebar-foreground:#e2e8f0;
    --sidebar-primary:#2563eb;
    --sidebar-accent:#1e2a4a;
    --sidebar-border:rgba(255,255,255,.07);
  }
  .dark {
    --background:#0a0f1e; --foreground:#e2e8f0;
    --card:#111827; --card-foreground:#e2e8f0;
    --primary:#3b82f6; --primary-foreground:#ffffff;
    --secondary:#1e2a4a; --secondary-foreground:#e2e8f0;
    --muted:#1e293b; --muted-foreground:#94a3b8;
    --accent:#1e3a5f; --accent-foreground:#93c5fd;
    --border:rgba(255,255,255,.08);
    --input-background:#1e293b;
    --sidebar:#070d1a; --sidebar-foreground:#cbd5e1;
    --sidebar-accent:#0f1729;
    --sidebar-border:rgba(255,255,255,.05);
  }
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; font-size:14px; }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#94a3b8; border-radius:2px; }
  @keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
`;

// ─── Nav config ───────────────────────────────────────────────────────────────
interface NavItem {
  id: ActivePage;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}
const MAIN_NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  {
    id: "projects",
    label: "Projects",
    icon: <FolderKanban size={16} />,
    badge: 3,
  },
  { id: "tasks", label: "Tasks", icon: <CheckSquare size={16} />, badge: 7 },
  { id: "my-work", label: "My Work", icon: <User size={16} /> },
  { id: "timesheet", label: "Timesheet", icon: <Clock size={16} /> },
  { id: "attendance", label: "Attendance", icon: <Calendar size={16} /> },
  { id: "leave", label: "Leave Management", icon: <Umbrella size={16} /> },
  { id: "clients", label: "Clients", icon: <Briefcase size={16} /> },
  { id: "documents", label: "Documents", icon: <FileText size={16} /> },
  { id: "meetings", label: "Meetings", icon: <Video size={16} />, badge: 2 },
  { id: "learning", label: "Learning", icon: <BookOpen size={16} /> },
  { id: "performance", label: "Performance", icon: <TrendingUp size={16} /> },
];
const BOTTOM_NAV: NavItem[] = [
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell size={16} />,
    badge: 5,
  },
  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
];

// ─── Shared UI helpers ────────────────────────────────────────────────────────
function Card({
  children,
  style,
  onClick,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <h2
        style={{
          fontSize: "18px",
          fontWeight: 600,
          color: "var(--foreground)",
        }}
      >
        {title}
      </h2>
      {sub && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--muted-foreground)",
            marginTop: "2px",
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}
function Badge({
  label,
  bg,
  color,
}: {
  label: string;
  bg: string;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        fontSize: "11px",
        padding: "2px 8px",
        borderRadius: "999px",
        background: bg,
        color,
      }}
    >
      {label}
    </span>
  );
}
function ProgressBar({
  value,
  color = "var(--primary)",
  height = "6px",
}: {
  value: number;
  color?: string;
  height?: string;
}) {
  return (
    <div style={{ height, borderRadius: "999px", background: "var(--muted)" }}>
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          borderRadius: "999px",
          background: color,
          transition: "width .5s",
        }}
      />
    </div>
  );
}

const CHART_TOOLTIP_STYLE = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  fontSize: "12px",
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function NavButton({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 12px",
        borderRadius: "6px",
        textAlign: "left",
        background: active
          ? "rgba(37,99,235,.25)"
          : hovered
            ? "var(--sidebar-accent)"
            : "transparent",
        color: active ? "#93c5fd" : "var(--sidebar-foreground)",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "all .15s",
        fontSize: "12px",
        fontWeight: active ? 600 : 400,
      }}
    >
      {active && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "2px",
            height: "20px",
            background: "#60a5fa",
            borderRadius: "0 2px 2px 0",
          }}
        />
      )}
      <span style={{ flexShrink: 0 }}>{item.icon}</span>
      {!collapsed && (
        <>
          <span
            style={{
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.label}
          </span>
          {item.badge !== undefined && (
            <span
              style={{
                background: "rgba(37,99,235,.4)",
                color: "#93c5fd",
                fontSize: "10px",
                padding: "1px 6px",
                borderRadius: "999px",
              }}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && item.badge !== undefined && (
        <span
          style={{
            position: "absolute",
            top: "-4px",
            right: "-4px",
            width: "16px",
            height: "16px",
            borderRadius: "999px",
            background: "var(--primary)",
            color: "#fff",
            fontSize: "9px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {item.badge}
        </span>
      )}
    </button>
  );
}

function Sidebar({
  activePage,
  onNavigate,
  collapsed,
  onCollapse,
  mobileOpen,
  onMobileClose,
  onLogout,
}: {
  activePage: ActivePage;
  onNavigate: (p: ActivePage) => void;
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onLogout: () => void;
}) {
  const go = (page: ActivePage) => {
    onNavigate(page);
    onMobileClose();
  };
  const labelStyle: React.CSSProperties = {
    padding: "6px 12px",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(148,163,184,.55)",
    display: collapsed ? "none" : "block",
  };

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--sidebar)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "16px",
          borderBottom: "1px solid var(--sidebar-border)",
        }}
      >
        <div
          style={{
            flexShrink: 0,
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "var(--primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Building2 size={16} color="#fff" />
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "13px",
                lineHeight: "1.2",
                whiteSpace: "nowrap",
              }}
            >
              Lotus Prime
            </div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: "11px",
                whiteSpace: "nowrap",
              }}
            >
              Employee Portal
            </div>
          </div>
        )}
        <button
          onClick={() => onCollapse(!collapsed)}
          style={{
            marginLeft: "auto",
            width: "24px",
            height: "24px",
            borderRadius: "4px",
            background: "var(--sidebar-accent)",
            border: "none",
            color: "var(--sidebar-foreground)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </div>

      <nav
        style={{
          flex: 1,
          padding: "8px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        <div style={labelStyle}>Main Menu</div>
        {MAIN_NAV.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={activePage === item.id}
            collapsed={collapsed}
            onClick={() => go(item.id)}
          />
        ))}
        <div style={{ ...labelStyle, marginTop: "12px" }}>Tools</div>
        <NavButton
          item={{
            id: "role-dashboard",
            label: "My Role Dashboard",
            icon: <Users size={16} />,
          }}
          active={activePage === "role-dashboard"}
          collapsed={collapsed}
          onClick={() => go("role-dashboard")}
        />
        <NavButton
          item={{
            id: "ai-assistant",
            label: "AI Assistant",
            icon: <Bot size={16} />,
          }}
          active={activePage === "ai-assistant"}
          collapsed={collapsed}
          onClick={() => go("ai-assistant")}
        />
        <div style={{ ...labelStyle, marginTop: "12px" }}>Admin</div>
        <NavButton
          item={{
            id: "admin",
            label: "Admin Panel",
            icon: <Building2 size={16} />,
          }}
          active={activePage === "admin"}
          collapsed={collapsed}
          onClick={() => go("admin")}
        />
      </nav>

      <div
        style={{
          padding: "8px",
          borderTop: "1px solid var(--sidebar-border)",
          display: "flex",
          flexDirection: "column",
          gap: "2px",
        }}
      >
        {BOTTOM_NAV.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={activePage === item.id}
            collapsed={collapsed}
            onClick={() => go(item.id)}
          />
        ))}
        <button
          onClick={onLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px",
            borderRadius: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#94a3b8",
            fontSize: "12px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
        >
          <span style={{ flexShrink: 0 }}>⏻</span>
          {!collapsed && "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        style={{
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          width: collapsed ? "60px" : "220px",
          height: "100%",
          transition: "width .3s",
          background: "var(--sidebar)",
          overflow: "hidden",
        }}
      >
        {content}
      </aside>
      {mobileOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,.5)",
            }}
            onClick={onMobileClose}
          />
          <aside
            style={{
              position: "relative",
              width: "256px",
              height: "100%",
              zIndex: 10,
              boxShadow: "0 25px 50px rgba(0,0,0,.4)",
            }}
          >
            <button
              onClick={onMobileClose}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                color: "var(--sidebar-foreground)",
                cursor: "pointer",
                zIndex: 11,
              }}
            >
              <X size={18} />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

// ─── Top Nav ──────────────────────────────────────────────────────────────────
const PAGE_LABELS: Record<ActivePage, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  tasks: "Tasks",
  "my-work": "My Work",
  timesheet: "Timesheet",
  attendance: "Attendance",
  leave: "Leave Management",
  clients: "Clients",
  documents: "Documents",
  meetings: "Meetings",
  learning: "Learning",
  performance: "Performance",
  notifications: "Notifications",
  settings: "Settings",
  admin: "Admin Panel",
  "ai-assistant": "AI Assistant",
  "role-dashboard": "My Role Dashboard",
};
const NOTIFS = [
  {
    title: "Task Due Soon",
    desc: "Homepage redesign is due tomorrow",
    time: "5m ago",
    type: "warning",
  },
  {
    title: "Leave Approved",
    desc: "Your leave request has been approved",
    time: "1h ago",
    type: "success",
  },
  {
    title: "Meeting Reminder",
    desc: "Standup in 15 minutes",
    time: "2h ago",
    type: "info",
  },
  {
    title: "New Comment",
    desc: "Sarah commented on PROJ-42",
    time: "3h ago",
    type: "default",
  },
  {
    title: "PR Reviewed",
    desc: "Your pull request has been reviewed",
    time: "5h ago",
    type: "success",
  },
];

function TopNav({
  activePage,
  isDark,
  onToggleDark,
  onMobileMenu,
  onNavigate,
}: {
  activePage: ActivePage;
  isDark: boolean;
  onToggleDark: () => void;
  onMobileMenu: () => void;
  onNavigate: (p: ActivePage) => void;
}) {
  const [showQuick, setShowQuick] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const nc: Record<string, string> = {
    warning: "#f59e0b",
    success: "#10b981",
    info: "#3b82f6",
    default: "#94a3b8",
  };

  return (
    <header
      style={{
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 16px",
        borderBottom: "1px solid var(--border)",
        background: "var(--card)",
      }}
    >
      <button
        onClick={onMobileMenu}
        style={{
          padding: "6px",
          borderRadius: "6px",
          background: "none",
          border: "none",
          color: "var(--muted-foreground)",
          cursor: "pointer",
        }}
      >
        <Menu size={18} />
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
          Lotus Prime
        </span>
        <span style={{ color: "var(--border)" }}>/</span>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--foreground)",
          }}
        >
          {PAGE_LABELS[activePage]}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          maxWidth: "320px",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          borderRadius: "8px",
          background: "var(--input-background)",
          border: "1px solid var(--border)",
          marginLeft: "12px",
        }}
      >
        <Search
          size={13}
          style={{ color: "var(--muted-foreground)", flexShrink: 0 }}
        />
        <input
          placeholder="Search…"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "12px",
            color: "var(--foreground)",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginLeft: "auto",
        }}
      >
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowQuick(!showQuick);
              setShowNotif(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "8px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              fontSize: "12px",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <Plus size={13} /> Quick Add <ChevronDown size={11} />
          </button>
          {showQuick && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                marginTop: "4px",
                width: "180px",
                borderRadius: "10px",
                boxShadow: "0 8px 32px rgba(0,0,0,.12)",
                border: "1px solid var(--border)",
                background: "var(--card)",
                zIndex: 50,
                padding: "4px",
              }}
            >
              {["New Task", "Log Time", "Apply Leave", "Schedule Meeting"].map(
                (a) => (
                  <button
                    key={a}
                    onClick={() => setShowQuick(false)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      background: "none",
                      border: "none",
                      fontSize: "12px",
                      color: "var(--foreground)",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--muted)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    {a}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
        <button
          onClick={onToggleDark}
          style={{
            padding: "6px",
            borderRadius: "6px",
            background: "none",
            border: "none",
            color: "var(--muted-foreground)",
            cursor: "pointer",
          }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowNotif(!showNotif);
              setShowQuick(false);
            }}
            style={{
              position: "relative",
              padding: "6px",
              borderRadius: "6px",
              background: "none",
              border: "none",
              color: "var(--muted-foreground)",
              cursor: "pointer",
            }}
          >
            <Bell size={16} />
            <span
              style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                width: "16px",
                height: "16px",
                borderRadius: "999px",
                background: "#dc2626",
                color: "#fff",
                fontSize: "9px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              5
            </span>
          </button>
          {showNotif && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                marginTop: "4px",
                width: "300px",
                borderRadius: "10px",
                boxShadow: "0 8px 32px rgba(0,0,0,.14)",
                border: "1px solid var(--border)",
                background: "var(--card)",
                zIndex: 50,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                  }}
                >
                  Notifications
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    background: "var(--primary)",
                    color: "#fff",
                  }}
                >
                  5 new
                </span>
              </div>
              {NOTIFS.map((n, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "10px",
                    padding: "10px 14px",
                    borderBottom: "1px solid var(--border)",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--muted)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
                >
                  <span
                    style={{
                      marginTop: "3px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "999px",
                      flexShrink: 0,
                      background: nc[n.type],
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {n.title}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {n.desc}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--muted-foreground)",
                      flexShrink: 0,
                    }}
                  >
                    {n.time}
                  </span>
                </div>
              ))}
              <button
                onClick={() => {
                  onNavigate("notifications");
                  setShowNotif(false);
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "12px",
                  color: "var(--primary)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View all
              </button>
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            paddingLeft: "10px",
            borderLeft: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "999px",
              background: "var(--primary)",
              color: "#fff",
              fontSize: "11px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            LP
          </div>
          <div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--foreground)",
                lineHeight: 1.2,
              }}
            >
              Employee
            </p>
            <p style={{ fontSize: "10px", color: "var(--muted-foreground)" }}>
              Lotus Prime
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────
const TASK_DATA = [
  { day: "Mon", completed: 8, assigned: 12 },
  { day: "Tue", completed: 11, assigned: 14 },
  { day: "Wed", completed: 7, assigned: 10 },
  { day: "Thu", completed: 13, assigned: 15 },
  { day: "Fri", completed: 9, assigned: 11 },
  { day: "Sat", completed: 5, assigned: 6 },
  { day: "Sun", completed: 2, assigned: 3 },
];
const HOURS_DATA = [
  { week: "W1", hours: 38, target: 40 },
  { week: "W2", hours: 42, target: 40 },
  { week: "W3", hours: 36, target: 40 },
  { week: "W4", hours: 44, target: 40 },
];
const TEAM_PERF = [
  { name: "Development", value: 87, color: "#2563eb" },
  { name: "Design", value: 74, color: "#6366f1" },
  { name: "QA", value: 92, color: "#10b981" },
  { name: "Marketing", value: 68, color: "#f59e0b" },
];
const PROJECT_PROGRESS = [
  {
    name: "Mobile App Redesign",
    progress: 78,
    status: "on-track",
    team: 5,
    due: "Jun 30",
  },
  {
    name: "CRM Integration",
    progress: 45,
    status: "at-risk",
    team: 3,
    due: "Jun 25",
  },
  {
    name: "Analytics Dashboard",
    progress: 92,
    status: "on-track",
    team: 4,
    due: "Jun 20",
  },
  {
    name: "API Gateway Setup",
    progress: 30,
    status: "behind",
    team: 2,
    due: "Jul 15",
  },
];
const STAT_CARDS: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  href: ActivePage;
}[] = [
  {
    title: "Assigned Tasks",
    value: "24",
    change: "+3 today",
    icon: <CheckSquare size={18} />,
    color: "#2563eb",
    bg: "rgba(37,99,235,.1)",
    href: "tasks",
  },
  {
    title: "Projects Assigned",
    value: "6",
    change: "2 active",
    icon: <FolderKanban size={18} />,
    color: "#6366f1",
    bg: "rgba(99,102,241,.1)",
    href: "projects",
  },
  {
    title: "Today's Meetings",
    value: "3",
    change: "Next: 9:00 AM",
    icon: <Video size={18} />,
    color: "#0ea5e9",
    bg: "rgba(14,165,233,.1)",
    href: "meetings",
  },
  {
    title: "Pending Approvals",
    value: "5",
    change: "2 urgent",
    icon: <Bell size={18} />,
    color: "#f59e0b",
    bg: "rgba(245,158,11,.1)",
    href: "notifications",
  },
  {
    title: "Hours Logged Today",
    value: "6.5h",
    change: "Target: 8h",
    icon: <Clock size={18} />,
    color: "#10b981",
    bg: "rgba(16,185,129,.1)",
    href: "timesheet",
  },
  {
    title: "Performance Score",
    value: "87%",
    change: "+2% this month",
    icon: <TrendingUp size={18} />,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,.1)",
    href: "performance",
  },
  {
    title: "Leave Balance",
    value: "12 days",
    change: "Annual: 24",
    icon: <Umbrella size={18} />,
    color: "#ec4899",
    bg: "rgba(236,72,153,.1)",
    href: "leave",
  },
  {
    title: "Upcoming Deadlines",
    value: "4",
    change: "This week",
    icon: <Calendar size={18} />,
    color: "#ef4444",
    bg: "rgba(239,68,68,.1)",
    href: "tasks",
  },
];
const RECENT_TASKS = [
  {
    name: "Design login flow wireframes",
    project: "Mobile App",
    priority: "high",
    status: "in-progress",
    due: "Today",
  },
  {
    name: "Fix authentication bug",
    project: "CRM",
    priority: "critical",
    status: "blocked",
    due: "Overdue",
  },
  {
    name: "Write unit tests for API",
    project: "Analytics",
    priority: "medium",
    status: "todo",
    due: "Tomorrow",
  },
  {
    name: "Update deployment scripts",
    project: "API Gateway",
    priority: "low",
    status: "review",
    due: "Jun 18",
  },
];
const MEETINGS_TODAY = [
  { title: "Daily Standup", time: "9:00 AM", dur: "15 min", type: "team" },
  {
    title: "Client Review — Mobile App",
    time: "11:00 AM",
    dur: "1 hr",
    type: "client",
  },
  { title: "Sprint Planning", time: "3:00 PM", dur: "2 hrs", type: "team" },
];
const PROJ_STATUS_COLOR: Record<string, { text: string; bg: string }> = {
  "on-track": { text: "#10b981", bg: "rgba(16,185,129,.1)" },
  "at-risk": { text: "#f59e0b", bg: "rgba(245,158,11,.1)" },
  behind: { text: "#ef4444", bg: "rgba(239,68,68,.1)" },
};
const TASK_STATUS_COLOR: Record<
  string,
  { text: string; bg: string; label: string }
> = {
  "in-progress": {
    text: "#3b82f6",
    bg: "rgba(59,130,246,.15)",
    label: "In Progress",
  },
  blocked: { text: "#ef4444", bg: "rgba(239,68,68,.15)", label: "Blocked" },
  todo: { text: "#64748b", bg: "rgba(100,116,139,.15)", label: "To Do" },
  review: { text: "#8b5cf6", bg: "rgba(139,92,246,.15)", label: "Review" },
  completed: {
    text: "#10b981",
    bg: "rgba(16,185,129,.15)",
    label: "Completed",
  },
};
const PRIORITY_COLOR: Record<string, string> = {
  critical: "#ef4444",
  high: "#f59e0b",
  medium: "#3b82f6",
  low: "#94a3b8",
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ onNavigate }: { onNavigate: (p: ActivePage) => void }) {
  const [activeChart, setActiveChart] = useState<"tasks" | "hours">("tasks");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        paddingBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            Good morning 👋
          </h1>
          <p
            style={{
              fontSize: "12px",
              color: "var(--muted-foreground)",
              marginTop: "2px",
            }}
          >
            Lotus Prime Digital Solutions · Employee Portal
          </p>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 500,
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          + New Task
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
          gap: "12px",
        }}
      >
        {STAT_CARDS.map((c) => (
          <Card
            key={c.title}
            style={{ padding: "16px", cursor: "pointer" }}
            onClick={() => onNavigate(c.href)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: c.bg,
                  color: c.color,
                }}
              >
                {c.icon}
              </div>
              <ArrowUpRight
                size={14}
                style={{ color: c.color, opacity: 0.6 }}
              />
            </div>
            <p
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              {c.value}
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "var(--muted-foreground)",
                marginTop: "2px",
              }}
            >
              {c.title}
            </p>
            <p
              style={{
                fontSize: "11px",
                color: c.color,
                marginTop: "2px",
                fontWeight: 500,
              }}
            >
              {c.change}
            </p>
          </Card>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "16px",
        }}
      >
        <Card style={{ padding: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "var(--foreground)",
              }}
            >
              Activity Overview
            </span>
            <div
              style={{
                display: "flex",
                gap: "2px",
                padding: "4px",
                borderRadius: "8px",
                background: "var(--muted)",
              }}
            >
              {(["tasks", "hours"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveChart(t)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    background:
                      activeChart === t ? "var(--card)" : "transparent",
                    color:
                      activeChart === t
                        ? "var(--foreground)"
                        : "var(--muted-foreground)",
                  }}
                >
                  {t === "tasks" ? "Task Completion" : "Hours"}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            {activeChart === "tasks" ? (
              <AreaChart data={TASK_DATA}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Area
                  type="monotone"
                  dataKey="assigned"
                  stroke="#2563eb"
                  fill="url(#g1)"
                  strokeWidth={2}
                  name="Assigned"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  fill="url(#g2)"
                  strokeWidth={2}
                  name="Completed"
                />
              </AreaChart>
            ) : (
              <BarChart data={HOURS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                <Bar
                  dataKey="hours"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  name="Logged"
                />
                <Bar
                  dataKey="target"
                  fill="var(--muted)"
                  radius={[4, 4, 0, 0]}
                  name="Target"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Card>

        <Card style={{ padding: "20px" }}>
          <p
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: "var(--foreground)",
              marginBottom: "16px",
            }}
          >
            Team Performance
          </p>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {TEAM_PERF.map((t) => (
              <div key={t.name}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "12px", color: "var(--foreground)" }}
                  >
                    {t.name}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: t.color,
                    }}
                  >
                    {t.value}%
                  </span>
                </div>
                <ProgressBar value={t.value} color={t.color} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "16px",
        }}
      >
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 20px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                fontWeight: 600,
                fontSize: "14px",
                color: "var(--foreground)",
              }}
            >
              Project Progress
            </span>
          </div>
          {PROJECT_PROGRESS.map((p) => (
            <div
              key={p.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "12px 20px",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--muted)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.name}
                  </span>
                  <Badge
                    label={p.status.replace("-", " ")}
                    bg={PROJ_STATUS_COLOR[p.status].bg}
                    color={PROJ_STATUS_COLOR[p.status].text}
                  />
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div style={{ flex: 1 }}>
                    <ProgressBar
                      value={p.progress}
                      color={PROJ_STATUS_COLOR[p.status].text}
                      height="5px"
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                      flexShrink: 0,
                    }}
                  >
                    {p.progress}%
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  flexShrink: 0,
                  fontSize: "11px",
                }}
              >
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "var(--muted-foreground)" }}>Team</p>
                  <p style={{ fontWeight: 600, color: "var(--foreground)" }}>
                    {p.team}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "var(--muted-foreground)" }}>Due</p>
                  <p style={{ fontWeight: 600, color: "var(--foreground)" }}>
                    {p.due}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Card>
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "var(--foreground)",
                }}
              >
                Today's Meetings
              </span>
              <button
                onClick={() => onNavigate("meetings")}
                style={{
                  fontSize: "11px",
                  color: "var(--primary)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View all →
              </button>
            </div>
            <div
              style={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {MEETINGS_TODAY.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    background: "var(--muted)",
                  }}
                >
                  <div
                    style={{
                      width: "3px",
                      height: "36px",
                      borderRadius: "999px",
                      background: m.type === "client" ? "#f59e0b" : "#2563eb",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {m.title}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {m.time} · {m.dur}
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate("meetings")}
                    style={{
                      flexShrink: 0,
                      fontSize: "11px",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "13px",
                  color: "var(--foreground)",
                }}
              >
                Recent Tasks
              </span>
              <button
                onClick={() => onNavigate("tasks")}
                style={{
                  fontSize: "11px",
                  color: "var(--primary)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View all →
              </button>
            </div>
            <div
              style={{
                padding: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {RECENT_TASKS.map((t, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--muted)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "999px",
                      background: PRIORITY_COLOR[t.priority],
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--foreground)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t.name}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {t.project}
                    </p>
                  </div>
                  <Badge
                    label={TASK_STATUS_COLOR[t.status].label}
                    bg={TASK_STATUS_COLOR[t.status].bg}
                    color={TASK_STATUS_COLOR[t.status].text}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Tasks (Kanban + List) ────────────────────────────────────────────────────
const ALL_TASKS = [
  {
    id: "T-001",
    name: "Design login flow wireframes",
    project: "Mobile App",
    priority: "high",
    status: "In Progress",
    due: "2026-06-14",
    comments: 3,
    attachments: 2,
  },
  {
    id: "T-002",
    name: "Fix authentication bug in OAuth",
    project: "CRM Integration",
    priority: "critical",
    status: "Blocked",
    due: "2026-06-12",
    comments: 7,
    attachments: 0,
  },
  {
    id: "T-003",
    name: "Write unit tests for payment API",
    project: "Analytics",
    priority: "medium",
    status: "To Do",
    due: "2026-06-15",
    comments: 1,
    attachments: 1,
  },
  {
    id: "T-004",
    name: "Update deployment scripts for prod",
    project: "API Gateway",
    priority: "low",
    status: "Review",
    due: "2026-06-18",
    comments: 2,
    attachments: 3,
  },
  {
    id: "T-005",
    name: "Client presentation slides",
    project: "Mobile App",
    priority: "high",
    status: "Completed",
    due: "2026-06-11",
    comments: 5,
    attachments: 4,
  },
  {
    id: "T-006",
    name: "Refactor user service module",
    project: "CRM Integration",
    priority: "medium",
    status: "In Progress",
    due: "2026-06-20",
    comments: 0,
    attachments: 0,
  },
  {
    id: "T-007",
    name: "Setup monitoring & alerting",
    project: "API Gateway",
    priority: "high",
    status: "To Do",
    due: "2026-06-22",
    comments: 0,
    attachments: 0,
  },
];
const PRIO_CFG: Record<string, { color: string; bg: string }> = {
  critical: { color: "#ef4444", bg: "rgba(239,68,68,.12)" },
  high: { color: "#f59e0b", bg: "rgba(245,158,11,.12)" },
  medium: { color: "#3b82f6", bg: "rgba(59,130,246,.12)" },
  low: { color: "#94a3b8", bg: "rgba(148,163,184,.12)" },
};
const STAT_CFG: Record<string, { color: string; bg: string }> = {
  "To Do": { color: "#64748b", bg: "rgba(100,116,139,.12)" },
  "In Progress": { color: "#2563eb", bg: "rgba(37,99,235,.12)" },
  Blocked: { color: "#ef4444", bg: "rgba(239,68,68,.12)" },
  Review: { color: "#8b5cf6", bg: "rgba(139,92,246,.12)" },
  Completed: { color: "#10b981", bg: "rgba(16,185,129,.12)" },
};
const TASK_STATUS_TABS = [
  "All",
  "To Do",
  "In Progress",
  "Blocked",
  "Review",
  "Completed",
];

function MyTasks() {
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  const filtered = ALL_TASKS.filter(
    (t) =>
      (activeStatus === "All" || t.status === activeStatus) &&
      (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.project.toLowerCase().includes(search.toLowerCase())),
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <SectionHeader
          title="My Tasks"
          sub={`${ALL_TASKS.length} tasks · ${ALL_TASKS.filter((t) => t.status === "Completed").length} completed`}
        />
        <div style={{ display: "flex", gap: "8px" }}>
          <div
            style={{
              display: "flex",
              gap: "2px",
              padding: "4px",
              borderRadius: "8px",
              background: "var(--muted)",
            }}
          >
            {(["list", "board"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  background: viewMode === v ? "var(--card)" : "transparent",
                  color:
                    viewMode === v
                      ? "var(--foreground)"
                      : "var(--muted-foreground)",
                  textTransform: "capitalize",
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <Plus size={13} /> Add Task
          </button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 12px",
            borderRadius: "8px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            minWidth: "200px",
            flex: 1,
          }}
        >
          <Search size={13} style={{ color: "var(--muted-foreground)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "12px",
              color: "var(--foreground)",
            }}
          />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {TASK_STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              style={{
                padding: "5px 12px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 500,
                cursor: "pointer",
                background:
                  activeStatus === s ? "var(--primary)" : "var(--card)",
                color: activeStatus === s ? "#fff" : "var(--muted-foreground)",
                border: `1px solid ${activeStatus === s ? "var(--primary)" : "var(--border)"}`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      {viewMode === "list" ? (
        <Card>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "3fr 2fr 1fr 1.5fr 1fr 1fr auto",
              gap: "8px",
              padding: "10px 16px",
              borderBottom: "1px solid var(--border)",
              background: "var(--muted)",
              borderRadius: "12px 12px 0 0",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--muted-foreground)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            <div>Task</div>
            <div>Project</div>
            <div>Priority</div>
            <div>Status</div>
            <div>Due</div>
            <div>Activity</div>
            <div></div>
          </div>
          {filtered.map((task) => (
            <div
              key={task.id}
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 2fr 1fr 1.5fr 1fr 1fr auto",
                gap: "8px",
                padding: "10px 16px",
                borderBottom: "1px solid var(--border)",
                alignItems: "center",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--muted)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    color: "var(--muted-foreground)",
                    flexShrink: 0,
                  }}
                >
                  {task.id}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {task.name}
                </span>
              </div>
              <span
                style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
              >
                {task.project}
              </span>
              <Badge
                label={task.priority}
                bg={PRIO_CFG[task.priority].bg}
                color={PRIO_CFG[task.priority].color}
              />
              <Badge
                label={task.status}
                bg={STAT_CFG[task.status].bg}
                color={STAT_CFG[task.status].color}
              />
              <span
                style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
              >
                {task.due.slice(5)}
              </span>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <MessageSquare size={11} />
                  {task.comments}
                </span>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <Paperclip size={11} />
                  {task.attachments}
                </span>
              </div>
              <MoreHorizontal
                size={14}
                style={{ color: "var(--muted-foreground)" }}
              />
            </div>
          ))}
          {filtered.length === 0 && (
            <p
              style={{
                textAlign: "center",
                padding: "32px",
                fontSize: "13px",
                color: "var(--muted-foreground)",
              }}
            >
              No tasks found
            </p>
          )}
        </Card>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "14px",
            overflowX: "auto",
            paddingBottom: "12px",
          }}
        >
          {TASK_STATUS_TABS.filter((s) => s !== "All").map((col) => (
            <div
              key={col}
              style={{
                flexShrink: 0,
                width: "270px",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--card)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background: STAT_CFG[col]?.color || "#94a3b8",
                  }}
                />
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                  }}
                >
                  {col}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "11px",
                    padding: "1px 7px",
                    borderRadius: "999px",
                    background: "var(--muted)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {ALL_TASKS.filter((t) => t.status === col).length}
                </span>
              </div>
              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  minHeight: "80px",
                }}
              >
                {ALL_TASKS.filter((t) => t.status === col).map((task) => (
                  <div
                    key={task.id}
                    style={{
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--background)",
                      cursor: "pointer",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "var(--foreground)",
                        lineHeight: 1.4,
                        marginBottom: "6px",
                      }}
                    >
                      {task.name}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                        marginBottom: "8px",
                      }}
                    >
                      {task.project}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Badge
                        label={task.priority}
                        bg={PRIO_CFG[task.priority].bg}
                        color={PRIO_CFG[task.priority].color}
                      />
                      <span
                        style={{
                          fontSize: "10px",
                          color: "var(--muted-foreground)",
                        }}
                      >
                        {task.due.slice(5)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Attendance Punch ─────────────────────────────────────────────────────────
function Attendance() {
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState<string | null>(null);
  const [isRemote, setIsRemote] = useState(false);
  const punch = () => {
    setPunchTime(
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
    setIsPunchedIn(!isPunchedIn);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <SectionHeader
        title="Attendance"
        sub="Track daily attendance and work hours"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: "16px",
        }}
      >
        <Card
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
              Today
            </p>
            <p
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--foreground)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { label: "Office", remote: false, icon: <MapPin size={12} /> },
              { label: "Remote", remote: true, icon: <Wifi size={12} /> },
            ].map((opt) => (
              <button
                key={opt.label}
                onClick={() => setIsRemote(opt.remote)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  border: "none",
                  cursor: "pointer",
                  background:
                    isRemote === opt.remote
                      ? "rgba(37,99,235,.12)"
                      : "var(--muted)",
                  color:
                    isRemote === opt.remote
                      ? "#2563eb"
                      : "var(--muted-foreground)",
                  fontWeight: isRemote === opt.remote ? 600 : 400,
                }}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={punch}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              border: isPunchedIn ? "1px solid rgba(239,68,68,.3)" : "none",
              background: isPunchedIn
                ? "rgba(239,68,68,.12)"
                : "var(--primary)",
              color: isPunchedIn ? "#ef4444" : "#fff",
            }}
          >
            {isPunchedIn ? "Punch Out" : "Punch In"}
          </button>
          {punchTime && (
            <p style={{ fontSize: "11px", color: "var(--muted-foreground)" }}>
              {isPunchedIn
                ? `Punched in at ${punchTime}`
                : `Punched out at ${punchTime}`}
            </p>
          )}
        </Card>
        <Card style={{ padding: "20px" }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: "14px",
            }}
          >
            This Month Summary
          </p>
          {[
            ["Present Days", "10", "#10b981"],
            ["Absent Days", "1", "#ef4444"],
            ["Leave Days", "1", "#f59e0b"],
            ["Working Hours", "88.5h", "#2563eb"],
          ].map(([k, v, c]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
              }}
            >
              <span
                style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
              >
                {k}
              </span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: c }}>
                {v}
              </span>
            </div>
          ))}
          <div
            style={{
              marginTop: "14px",
              paddingTop: "12px",
              borderTop: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                marginBottom: "6px",
              }}
            >
              <span style={{ color: "var(--muted-foreground)" }}>
                Attendance Rate
              </span>
              <span style={{ color: "#10b981", fontWeight: 600 }}>91%</span>
            </div>
            <ProgressBar value={91} color="#10b981" height="8px" />
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Leave Management ─────────────────────────────────────────────────────────
const LEAVE_BALANCE = [
  { type: "Annual", total: 24, used: 7, pending: 5, color: "#2563eb" },
  { type: "Sick", total: 12, used: 3, pending: 0, color: "#10b981" },
  { type: "Casual", total: 6, used: 2, pending: 0, color: "#8b5cf6" },
  { type: "Emergency", total: 3, used: 1, pending: 0, color: "#ef4444" },
];
const LEAVE_HISTORY = [
  {
    type: "Annual Leave",
    from: "May 20",
    to: "May 24",
    days: 5,
    reason: "Family vacation",
    status: "approved",
  },
  {
    type: "Sick Leave",
    from: "Apr 15",
    to: "Apr 16",
    days: 2,
    reason: "Fever and cold",
    status: "approved",
  },
  {
    type: "Annual Leave",
    from: "Jun 20",
    to: "Jun 25",
    days: 5,
    reason: "Wedding ceremony",
    status: "pending",
  },
  {
    type: "Emergency Leave",
    from: "Feb 5",
    to: "Feb 5",
    days: 1,
    reason: "Medical emergency",
    status: "rejected",
  },
];
const LEAVE_STATUS: Record<string, { bg: string; text: string }> = {
  approved: { bg: "rgba(16,185,129,.12)", text: "#10b981" },
  pending: { bg: "rgba(245,158,11,.12)", text: "#f59e0b" },
  rejected: { bg: "rgba(239,68,68,.12)", text: "#ef4444" },
};

function LeaveManagement() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "", from: "", to: "", reason: "" });
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <SectionHeader
          title="Leave Management"
          sub="Apply, track, and manage leave requests"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "8px",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          <Plus size={13} /> Apply Leave
        </button>
      </div>
      {showForm && (
        <Card style={{ padding: "20px" }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--foreground)",
              marginBottom: "16px",
            }}
          >
            New Leave Application
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Leave Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  border: "1px solid var(--border)",
                  background: "var(--input-background)",
                  color: "var(--foreground)",
                  outline: "none",
                }}
              >
                <option value="">Select leave type</option>
                {[
                  "Annual Leave",
                  "Sick Leave",
                  "Casual Leave",
                  "Emergency Leave",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            {[
              { label: "From Date", key: "from" },
              { label: "To Date", key: "to" },
            ].map((f) => (
              <div key={f.key}>
                <label
                  style={{
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  {f.label}
                </label>
                <input
                  type="date"
                  value={(form as Record<string, string>)[f.key]}
                  onChange={(e) =>
                    setForm({ ...form, [f.key]: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    border: "1px solid var(--border)",
                    background: "var(--input-background)",
                    color: "var(--foreground)",
                    outline: "none",
                  }}
                />
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  fontSize: "11px",
                  color: "var(--muted-foreground)",
                  display: "block",
                  marginBottom: "6px",
                }}
              >
                Reason
              </label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  border: "1px solid var(--border)",
                  background: "var(--input-background)",
                  color: "var(--foreground)",
                  outline: "none",
                  resize: "none",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <button
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "transparent",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </Card>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
          gap: "12px",
        }}
      >
        {LEAVE_BALANCE.map((lb) => (
          <Card key={lb.type} style={{ padding: "16px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--foreground)",
                }}
              >
                {lb.type}
              </span>
              <Umbrella size={14} style={{ color: lb.color }} />
            </div>
            <p
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              {lb.total - lb.used - lb.pending}
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                  marginLeft: "4px",
                }}
              >
                / {lb.total}d
              </span>
            </p>
            <div style={{ margin: "8px 0" }}>
              <ProgressBar
                value={((lb.used + lb.pending) / lb.total) * 100}
                color={lb.color}
                height="5px"
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
              }}
            >
              <span style={{ color: "var(--muted-foreground)" }}>
                {lb.used} used
              </span>
              {lb.pending > 0 && (
                <span style={{ color: "#f59e0b" }}>{lb.pending} pending</span>
              )}
            </div>
          </Card>
        ))}
      </div>
      <Card style={{ overflowX: "auto" }}>
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--foreground)",
            }}
          >
            Leave History
          </p>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "600px",
          }}
        >
          <thead>
            <tr style={{ background: "var(--muted)" }}>
              {["Leave Type", "Duration", "Days", "Reason", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 16px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {LEAVE_HISTORY.map((l, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--muted)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <td
                  style={{
                    padding: "10px 16px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                  }}
                >
                  {l.type}
                </td>
                <td
                  style={{
                    padding: "10px 16px",
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {l.from} – {l.to}
                </td>
                <td
                  style={{
                    padding: "10px 16px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                  }}
                >
                  {l.days}d
                </td>
                <td
                  style={{
                    padding: "10px 16px",
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {l.reason}
                </td>
                <td style={{ padding: "10px 16px" }}>
                  <Badge
                    label={l.status}
                    bg={LEAVE_STATUS[l.status].bg}
                    color={LEAVE_STATUS[l.status].text}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Timesheet ────────────────────────────────────────────────────────────────
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_DATES = [
  "Jun 9",
  "Jun 10",
  "Jun 11",
  "Jun 12",
  "Jun 13",
  "Jun 14",
  "Jun 15",
];
const INIT_ENTRIES = [
  {
    project: "Mobile App Redesign",
    hours: [2, 3, 0, 2.5, 3, 0, 0],
    notes: "UI components, design review",
  },
  {
    project: "CRM Integration",
    hours: [3, 2, 4, 3, 1.5, 0, 0],
    notes: "API integration, bug fixes",
  },
  {
    project: "Analytics Dashboard",
    hours: [1.5, 1, 2, 1, 1.5, 0, 0],
    notes: "Chart implementation",
  },
  {
    project: "Internal Tools",
    hours: [0.5, 0, 0, 0.5, 0, 0, 0],
    notes: "Meetings, admin tasks",
  },
];

function Timesheet() {
  const [entries, setEntries] = useState(INIT_ENTRIES);
  const [editingCell, setEdit] = useState<{ r: number; c: number } | null>(
    null,
  );
  const [editVal, setEditVal] = useState("");
  const dailyTotals = WEEK_DAYS.map((_, i) =>
    entries.reduce((s, e) => s + (e.hours[i] || 0), 0),
  );
  const weekTotal = dailyTotals.reduce((a, b) => a + b, 0);
  const weekChart = WEEK_DAYS.map((day, i) => ({
    day,
    hours: entries.reduce((s, e) => s + e.hours[i], 0),
  }));
  const startEdit = (r: number, c: number, v: number) => {
    setEdit({ r, c });
    setEditVal(String(v));
  };
  const saveEdit = () => {
    if (!editingCell) return;
    const val = parseFloat(editVal) || 0;
    setEntries((prev) =>
      prev.map((e, i) =>
        i === editingCell.r
          ? {
              ...e,
              hours: e.hours.map((h, j) => (j === editingCell.c ? val : h)),
            }
          : e,
      ),
    );
    setEdit(null);
  };
  const cell: React.CSSProperties = {
    padding: "10px 8px",
    fontSize: "12px",
    textAlign: "center" as const,
    borderBottom: "1px solid var(--border)",
  };
  const th: React.CSSProperties = {
    ...cell,
    fontWeight: 700,
    fontSize: "11px",
    color: "var(--muted-foreground)",
    background: "var(--muted)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <SectionHeader
          title="Timesheet"
          sub="Track daily and weekly project hours"
        />
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            style={{
              padding: "6px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--card)",
              cursor: "pointer",
              color: "var(--foreground)",
              display: "flex",
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <span
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--foreground)",
            }}
          >
            Week of Jun 9, 2026
          </span>
          <button
            style={{
              padding: "6px",
              borderRadius: "8px",
              border: "1px solid var(--border)",
              background: "var(--card)",
              cursor: "pointer",
              color: "var(--foreground)",
              display: "flex",
            }}
          >
            <ChevronRight size={16} />
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <Save size={13} /> Submit Week
          </button>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
          gap: "12px",
        }}
      >
        {[
          {
            label: "This Week",
            value: `${weekTotal.toFixed(1)}h`,
            color: "#2563eb",
          },
          {
            label: "Today",
            value: `${dailyTotals[4].toFixed(1)}h`,
            color: "#10b981",
          },
          {
            label: "Billable",
            value: `${(weekTotal * 0.85).toFixed(1)}h`,
            color: "#8b5cf6",
          },
          { label: "Projects", value: `${entries.length}`, color: "#f59e0b" },
        ].map((s) => (
          <Card key={s.label} style={{ padding: "14px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "8px",
              }}
            >
              <Clock size={13} style={{ color: s.color }} />
              <span
                style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
              >
                {s.label}
              </span>
            </div>
            <p
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--foreground)",
              }}
            >
              {s.value}
            </p>
          </Card>
        ))}
      </div>
      <Card style={{ padding: "20px" }}>
        <p
          style={{
            fontWeight: 600,
            fontSize: "14px",
            color: "var(--foreground)",
            marginBottom: "16px",
          }}
        >
          Daily Hours
        </p>
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={weekChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
            <Bar dataKey="hours" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            minWidth: "700px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ ...th, textAlign: "left", padding: "10px 16px" }}>
                Project
              </th>
              {WEEK_DAYS.map((d, i) => (
                <th key={d} style={th}>
                  <div>{d}</div>
                  <div style={{ fontWeight: 400, fontSize: "10px" }}>
                    {WEEK_DATES[i]}
                  </div>
                </th>
              ))}
              <th style={th}>Total</th>
              <th style={{ ...th, textAlign: "left" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, r) => (
              <tr
                key={r}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--muted)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <td
                  style={{
                    ...cell,
                    textAlign: "left",
                    padding: "10px 16px",
                    fontWeight: 600,
                    fontSize: "12px",
                    color: "var(--foreground)",
                  }}
                >
                  {entry.project}
                </td>
                {entry.hours.map((h, c) => (
                  <td key={c} style={cell}>
                    {editingCell?.r === r && editingCell?.c === c ? (
                      <input
                        value={editVal}
                        onChange={(e) => setEditVal(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                        autoFocus
                        style={{
                          width: "48px",
                          textAlign: "center",
                          fontSize: "12px",
                          padding: "2px 4px",
                          borderRadius: "4px",
                          border: "1px solid var(--primary)",
                          outline: "none",
                          background: "var(--input-background)",
                          color: "var(--foreground)",
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(r, c, h)}
                        style={{
                          width: "48px",
                          fontSize: "12px",
                          padding: "4px",
                          borderRadius: "4px",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color:
                            h > 0
                              ? "var(--foreground)"
                              : "var(--muted-foreground)",
                        }}
                      >
                        {h > 0 ? h : "—"}
                      </button>
                    )}
                  </td>
                ))}
                <td
                  style={{ ...cell, fontWeight: 700, color: "var(--primary)" }}
                >
                  {entry.hours.reduce((a, b) => a + b, 0).toFixed(1)}h
                </td>
                <td
                  style={{
                    ...cell,
                    textAlign: "left",
                    padding: "10px 12px",
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {entry.notes}
                </td>
              </tr>
            ))}
            <tr style={{ background: "var(--muted)" }}>
              <td
                style={{
                  ...cell,
                  textAlign: "left",
                  padding: "10px 16px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                Daily Total
              </td>
              {dailyTotals.map((t, i) => (
                <td
                  key={i}
                  style={{
                    ...cell,
                    fontWeight: 700,
                    color:
                      t >= 8
                        ? "#10b981"
                        : t > 0
                          ? "#f59e0b"
                          : "var(--muted-foreground)",
                  }}
                >
                  {t > 0 ? `${t.toFixed(1)}h` : "—"}
                </td>
              ))}
              <td style={{ ...cell, fontWeight: 700, color: "var(--primary)" }}>
                {weekTotal.toFixed(1)}h
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Projects ────────────────────────────────────────────────────────────────
const PROJECTS_DATA = [
  {
    id: "P1",
    name: "Mobile App Redesign",
    client: "TechCorp Solutions",
    status: "on-track",
    progress: 78,
    budget: "₹8.4L",
    team: ["RK", "PS", "AM", "SP"],
    due: "Jun 30",
    tags: ["React Native", "UI/UX"],
  },
  {
    id: "P2",
    name: "CRM Integration",
    client: "GreenLeaf Retail",
    status: "at-risk",
    progress: 45,
    budget: "₹3.2L",
    team: ["RK", "AM"],
    due: "Jun 25",
    tags: ["Node.js", "API"],
  },
  {
    id: "P3",
    name: "Analytics Dashboard",
    client: "CloudNova Inc.",
    status: "on-track",
    progress: 92,
    budget: "₹5.6L",
    team: ["RK", "VG", "SP"],
    due: "Jun 20",
    tags: ["React", "Charts"],
  },
  {
    id: "P4",
    name: "API Gateway Setup",
    client: "Internal",
    status: "behind",
    progress: 30,
    budget: "₹2.1L",
    team: ["RK", "SK"],
    due: "Jul 15",
    tags: ["AWS", "DevOps"],
  },
  {
    id: "P5",
    name: "E-commerce Portal",
    client: "FinEdge Capital",
    status: "on-track",
    progress: 15,
    budget: "₹12.8L",
    team: ["RK", "PS", "AM", "SP", "VG", "SK"],
    due: "Aug 30",
    tags: ["Next.js", "Stripe"],
  },
];
const P_STATUS_COLOR: Record<string, { text: string; bg: string }> = {
  "on-track": { text: "#10b981", bg: "rgba(16,185,129,.12)" },
  "at-risk": { text: "#f59e0b", bg: "rgba(245,158,11,.12)" },
  behind: { text: "#ef4444", bg: "rgba(239,68,68,.12)" },
  completed: { text: "#2563eb", bg: "rgba(37,99,235,.12)" },
};
function Projects({
  onNavigateTasks,
}: {
  onNavigateTasks: (project: string) => void;
}) {
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const filtered = PROJECTS_DATA.filter(
    (p) =>
      (filterStatus === "all" || p.status === filterStatus) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.client.toLowerCase().includes(search.toLowerCase())),
  );
  const stats = [
    { label: "Total", value: PROJECTS_DATA.length, color: "#2563eb" },
    {
      label: "On Track",
      value: PROJECTS_DATA.filter((p) => p.status === "on-track").length,
      color: "#10b981",
    },
    {
      label: "At Risk",
      value: PROJECTS_DATA.filter((p) => p.status === "at-risk").length,
      color: "#f59e0b",
    },
    {
      label: "Behind",
      value: PROJECTS_DATA.filter((p) => p.status === "behind").length,
      color: "#ef4444",
    },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <SectionHeader
          title="Projects"
          sub={`${filtered.length} of ${PROJECTS_DATA.length} projects`}
        />
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "8px",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          <Plus size={13} /> New Project
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
          gap: "12px",
        }}
      >
        {stats.map((s) => (
          <Card key={s.label} style={{ padding: "14px" }}>
            <p
              style={{
                fontSize: "11px",
                color: "var(--muted-foreground)",
                marginBottom: "4px",
              }}
            >
              {s.label}
            </p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>
              {s.value}
            </p>
          </Card>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 12px",
            borderRadius: "8px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            flex: 1,
            minWidth: "200px",
          }}
        >
          <Search size={13} style={{ color: "var(--muted-foreground)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "12px",
              color: "var(--foreground)",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {["all", "on-track", "at-risk", "behind"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: "5px 12px",
                borderRadius: "999px",
                fontSize: "11px",
                border: `1px solid ${filterStatus === s ? "var(--primary)" : "var(--border)"}`,
                background:
                  filterStatus === s ? "var(--primary)" : "var(--card)",
                color: filterStatus === s ? "#fff" : "var(--muted-foreground)",
                cursor: "pointer",
              }}
            >
              {s === "all" ? "All" : s.replace("-", " ")}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: "2px",
            padding: "3px",
            borderRadius: "6px",
            background: "var(--muted)",
          }}
        >
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              style={{
                padding: "4px 10px",
                borderRadius: "4px",
                fontSize: "11px",
                border: "none",
                cursor: "pointer",
                background: viewMode === v ? "var(--card)" : "transparent",
                color:
                  viewMode === v
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      {viewMode === "grid" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
            gap: "14px",
          }}
        >
          {filtered.map((p) => (
            <Card
              key={p.id}
              style={{ padding: "18px", cursor: "pointer" }}
              onClick={() => onNavigateTasks(p.name)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                      marginBottom: "3px",
                    }}
                  >
                    {p.name}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {p.client}
                  </p>
                </div>
                <Badge
                  label={p.status.replace("-", " ")}
                  bg={P_STATUS_COLOR[p.status].bg}
                  color={P_STATUS_COLOR[p.status].text}
                />
              </div>
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    marginBottom: "4px",
                  }}
                >
                  <span style={{ color: "var(--muted-foreground)" }}>
                    Progress
                  </span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: P_STATUS_COLOR[p.status].text,
                    }}
                  >
                    {p.progress}%
                  </span>
                </div>
                <ProgressBar
                  value={p.progress}
                  color={P_STATUS_COLOR[p.status].text}
                  height="6px"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", gap: "-4px" }}>
                  {p.team.slice(0, 4).map((m, i) => (
                    <div
                      key={i}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "999px",
                        background: [
                          "#2563eb",
                          "#8b5cf6",
                          "#10b981",
                          "#f59e0b",
                          "#ef4444",
                          "#ec4899",
                        ][i % 6],
                        color: "#fff",
                        fontSize: "9px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid var(--card)",
                        marginLeft: i > 0 ? "-6px" : "0",
                      }}
                    >
                      {m}
                    </div>
                  ))}
                  {p.team.length > 4 && (
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "999px",
                        background: "var(--muted)",
                        color: "var(--muted-foreground)",
                        fontSize: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid var(--card)",
                        marginLeft: "-6px",
                      }}
                    >
                      +{p.team.length - 4}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "12px", fontSize: "11px" }}>
                  <span style={{ color: "var(--muted-foreground)" }}>
                    Due {p.due}
                  </span>
                  <span style={{ color: "#10b981", fontWeight: 600 }}>
                    {p.budget}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                  marginTop: "10px",
                }}
              >
                {p.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: "10px",
                      padding: "2px 7px",
                      borderRadius: "4px",
                      background: "var(--muted)",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          {filtered.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "16px",
                padding: "14px 20px",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--muted)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              onClick={() => onNavigateTasks(p.name)}
            >
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--foreground)",
                    }}
                  >
                    {p.name}
                  </span>
                  <Badge
                    label={p.status.replace("-", " ")}
                    bg={P_STATUS_COLOR[p.status].bg}
                    color={P_STATUS_COLOR[p.status].text}
                  />
                </div>
                <p
                  style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
                >
                  {p.client}
                </p>
              </div>
              <div style={{ width: "180px" }}>
                <ProgressBar
                  value={p.progress}
                  color={P_STATUS_COLOR[p.status].text}
                  height="5px"
                />
                <p
                  style={{
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                    marginTop: "3px",
                  }}
                >
                  {p.progress}% complete
                </p>
              </div>
              <div style={{ display: "flex", gap: "20px", fontSize: "12px" }}>
                <div>
                  <p style={{ color: "var(--muted-foreground)" }}>Budget</p>
                  <p style={{ fontWeight: 700, color: "#10b981" }}>
                    {p.budget}
                  </p>
                </div>
                <div>
                  <p style={{ color: "var(--muted-foreground)" }}>Due</p>
                  <p style={{ fontWeight: 600, color: "var(--foreground)" }}>
                    {p.due}
                  </p>
                </div>
                <div>
                  <p style={{ color: "var(--muted-foreground)" }}>Team</p>
                  <p style={{ fontWeight: 600, color: "var(--foreground)" }}>
                    {p.team.length}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── My Work ─────────────────────────────────────────────────────────────────
function MyWork({ onNavigate }: { onNavigate: (p: ActivePage) => void }) {
  const myTasks = ALL_TASKS.filter((t) =>
    ["In Progress", "Blocked"].includes(t.status),
  );
  const donePct = Math.round(
    (ALL_TASKS.filter((t) => t.status === "Completed").length /
      ALL_TASKS.length) *
      100,
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <SectionHeader
        title="My Work"
        sub="Everything assigned to you across all projects"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
          gap: "12px",
        }}
      >
        {[
          {
            label: "Total Assigned",
            value: ALL_TASKS.length,
            color: "#2563eb",
            href: "tasks" as ActivePage,
          },
          {
            label: "In Progress",
            value: ALL_TASKS.filter((t) => t.status === "In Progress").length,
            color: "#f59e0b",
            href: "tasks" as ActivePage,
          },
          {
            label: "Blocked",
            value: ALL_TASKS.filter((t) => t.status === "Blocked").length,
            color: "#ef4444",
            href: "tasks" as ActivePage,
          },
          {
            label: "Completed",
            value: ALL_TASKS.filter((t) => t.status === "Completed").length,
            color: "#10b981",
            href: "tasks" as ActivePage,
          },
        ].map((s) => (
          <Card
            key={s.label}
            style={{ padding: "14px", cursor: "pointer" }}
            onClick={() => onNavigate(s.href)}
          >
            <p
              style={{
                fontSize: "11px",
                color: "var(--muted-foreground)",
                marginBottom: "4px",
              }}
            >
              {s.label}
            </p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>
              {s.value}
            </p>
          </Card>
        ))}
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}
      >
        <Card style={{ padding: "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <p
              style={{
                fontWeight: 600,
                fontSize: "13px",
                color: "var(--foreground)",
              }}
            >
              Active Tasks
            </p>
            <button
              onClick={() => onNavigate("tasks")}
              style={{
                fontSize: "11px",
                color: "var(--primary)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              View all →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {myTasks.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px",
                  borderRadius: "8px",
                  background: "var(--muted)",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background: PRIO_CFG[t.priority]?.color || "#94a3b8",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--foreground)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t.name}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {t.project} · Due {t.due}
                  </p>
                </div>
                <Badge
                  label={t.status}
                  bg={STAT_CFG[t.status]?.bg || "var(--muted)"}
                  color={STAT_CFG[t.status]?.color || "#94a3b8"}
                />
              </div>
            ))}
          </div>
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Card style={{ padding: "16px" }}>
            <p
              style={{
                fontWeight: 600,
                fontSize: "13px",
                color: "var(--foreground)",
                marginBottom: "12px",
              }}
            >
              Weekly Progress
            </p>
            <div style={{ marginBottom: "6px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              >
                <span style={{ color: "var(--muted-foreground)" }}>
                  Tasks Completed
                </span>
                <span style={{ fontWeight: 700, color: "#10b981" }}>
                  {donePct}%
                </span>
              </div>
              <ProgressBar value={donePct} color="#10b981" height="8px" />
            </div>
            <div style={{ marginTop: "10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              >
                <span style={{ color: "var(--muted-foreground)" }}>
                  Hours Logged
                </span>
                <span style={{ fontWeight: 700, color: "#2563eb" }}>
                  32.5h / 40h
                </span>
              </div>
              <ProgressBar value={81} color="#2563eb" height="8px" />
            </div>
          </Card>
          <Card style={{ padding: "16px" }}>
            <p
              style={{
                fontWeight: 600,
                fontSize: "13px",
                color: "var(--foreground)",
                marginBottom: "10px",
              }}
            >
              Today's Schedule
            </p>
            {[
              { time: "9:00 AM", title: "Daily Standup", type: "team" },
              { time: "11:00 AM", title: "Client Review", type: "client" },
              { time: "3:00 PM", title: "Sprint Planning", type: "team" },
            ].map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "6px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                    width: "70px",
                    flexShrink: 0,
                  }}
                >
                  {m.time}
                </span>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--foreground)",
                    }}
                  >
                    {m.title}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: m.type === "client" ? "#f59e0b" : "#2563eb",
                    }}
                  >
                    {m.type}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate("meetings")}
                  style={{
                    fontSize: "11px",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    background: "#10b981",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Join
                </button>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Clients ─────────────────────────────────────────────────────────────────
const CLIENTS_DATA = [
  {
    id: 1,
    name: "TechCorp Solutions",
    contact: "Arun Mehta",
    email: "arun@techcorp.com",
    phone: "+91 98765 11001",
    projects: 2,
    value: "₹12.4L",
    status: "active",
    industry: "Technology",
    since: "Jan 2024",
  },
  {
    id: 2,
    name: "GreenLeaf Retail",
    contact: "Sneha Patel",
    email: "sneha@greenleaf.com",
    phone: "+91 98765 22002",
    projects: 1,
    value: "₹5.8L",
    status: "active",
    industry: "Retail",
    since: "Mar 2024",
  },
  {
    id: 3,
    name: "CloudNova Inc.",
    contact: "Raj Kumar",
    email: "raj@cloudnova.com",
    phone: "+91 98765 33003",
    projects: 3,
    value: "₹22.1L",
    status: "active",
    industry: "Technology",
    since: "Nov 2023",
  },
  {
    id: 4,
    name: "FinEdge Capital",
    contact: "Priya Shah",
    email: "priya@finedge.com",
    phone: "+91 98765 44004",
    projects: 1,
    value: "₹8.5L",
    status: "prospect",
    industry: "Finance",
    since: "Jun 2024",
  },
  {
    id: 5,
    name: "HealthTrack Pro",
    contact: "Dr. Nair",
    email: "nair@healthtrack.com",
    phone: "+91 98765 55005",
    projects: 2,
    value: "₹9.3L",
    status: "active",
    industry: "Healthcare",
    since: "Feb 2024",
  },
  {
    id: 6,
    name: "EduSpark Learning",
    contact: "Kavitha R",
    email: "k@eduspark.com",
    phone: "+91 98765 66006",
    projects: 1,
    value: "₹3.1L",
    status: "prospect",
    industry: "Education",
    since: "Jul 2024",
  },
];
const CLIENT_STATUS: Record<string, { bg: string; text: string }> = {
  active: { bg: "rgba(16,185,129,.12)", text: "#10b981" },
  prospect: { bg: "rgba(245,158,11,.12)", text: "#f59e0b" },
  inactive: { bg: "rgba(148,163,184,.12)", text: "#94a3b8" },
};
function Clients() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<(typeof CLIENTS_DATA)[0] | null>(
    null,
  );
  const filtered = CLIENTS_DATA.filter(
    (c) =>
      (filter === "all" || c.status === filter) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase())),
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <SectionHeader
          title="Clients"
          sub={`${filtered.length} clients · ${CLIENTS_DATA.filter((c) => c.status === "active").length} active`}
        />
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "8px",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          <Plus size={13} /> Add Client
        </button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "7px 12px",
            borderRadius: "8px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            flex: 1,
            minWidth: "200px",
          }}
        >
          <Search size={13} style={{ color: "var(--muted-foreground)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: "12px",
              color: "var(--foreground)",
            }}
          />
        </div>
        {["all", "active", "prospect"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "5px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              border: `1px solid ${filter === s ? "var(--primary)" : "var(--border)"}`,
              background: filter === s ? "var(--primary)" : "var(--card)",
              color: filter === s ? "#fff" : "var(--muted-foreground)",
              cursor: "pointer",
            }}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
          gap: "14px",
        }}
      >
        {filtered.map((c) => (
          <Card
            key={c.id}
            style={{ padding: "18px", cursor: "pointer" }}
            onClick={() => {
              setSelected(c);
              setShowModal(true);
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: [
                    "#2563eb",
                    "#8b5cf6",
                    "#10b981",
                    "#f59e0b",
                    "#ec4899",
                    "#0ea5e9",
                  ][c.id % 6],
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {c.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    marginBottom: "2px",
                  }}
                >
                  {c.name}
                </p>
                <p
                  style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
                >
                  {c.industry} · Since {c.since}
                </p>
              </div>
              <Badge
                label={c.status}
                bg={CLIENT_STATUS[c.status].bg}
                color={CLIENT_STATUS[c.status].text}
              />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              {[
                ["Contact", c.contact],
                ["Projects", String(c.projects)],
                ["Value", c.value],
                ["Phone", c.phone],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    padding: "8px",
                    borderRadius: "6px",
                    background: "var(--muted)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {k}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--foreground)",
                    }}
                  >
                    {v}
                  </p>
                </div>
              ))}
            </div>
            <a
              href={`mailto:${c.email}`}
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: "11px",
                color: "var(--primary)",
                textDecoration: "none",
              }}
            >
              {c.email}
            </a>
          </Card>
        ))}
      </div>
      {showModal && selected && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "var(--card)",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "480px",
              padding: "24px",
              boxShadow: "0 25px 50px rgba(0,0,0,.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                {selected.name}
              </p>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted-foreground)",
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            {[
              ["Contact Person", selected.contact],
              ["Email", selected.email],
              ["Phone", selected.phone],
              ["Industry", selected.industry],
              ["Projects", String(selected.projects)],
              ["Total Value", selected.value],
              ["Client Since", selected.since],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                  fontSize: "12px",
                }}
              >
                <span style={{ color: "var(--muted-foreground)" }}>{k}</span>
                <span style={{ fontWeight: 600, color: "var(--foreground)" }}>
                  {v}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <a
                href={`mailto:${selected.email}`}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px",
                  borderRadius: "8px",
                  background: "var(--primary)",
                  color: "#fff",
                  fontSize: "12px",
                  textDecoration: "none",
                }}
              >
                Send Email
              </a>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  background: "var(--muted)",
                  color: "var(--foreground)",
                  border: "none",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Documents ────────────────────────────────────────────────────────────────
const DOCS_DATA = [
  {
    id: 1,
    name: "Offer Letter",
    category: "hr",
    date: "Mar 1, 2024",
    size: "245 KB",
    type: "pdf",
    color: "#2563eb",
  },
  {
    id: 2,
    name: "Employment Contract",
    category: "hr",
    date: "Mar 1, 2024",
    size: "512 KB",
    type: "pdf",
    color: "#2563eb",
  },
  {
    id: 3,
    name: "Salary Slip — May 2026",
    category: "salary",
    date: "Jun 1, 2026",
    size: "128 KB",
    type: "pdf",
    color: "#10b981",
  },
  {
    id: 4,
    name: "Salary Slip — Apr 2026",
    category: "salary",
    date: "May 1, 2026",
    size: "128 KB",
    type: "pdf",
    color: "#10b981",
  },
  {
    id: 5,
    name: "Salary Slip — Mar 2026",
    category: "salary",
    date: "Apr 1, 2026",
    size: "128 KB",
    type: "pdf",
    color: "#10b981",
  },
  {
    id: 6,
    name: "Company Policy Handbook",
    category: "hr",
    date: "Jan 15, 2026",
    size: "1.2 MB",
    type: "pdf",
    color: "#8b5cf6",
  },
  {
    id: 7,
    name: "Mobile App Redesign PRD",
    category: "project",
    date: "May 20, 2026",
    size: "680 KB",
    type: "doc",
    color: "#f59e0b",
  },
  {
    id: 8,
    name: "CRM Integration Spec",
    category: "project",
    date: "Apr 12, 2026",
    size: "920 KB",
    type: "doc",
    color: "#f59e0b",
  },
  {
    id: 9,
    name: "React Best Practices",
    category: "training",
    date: "Jun 5, 2026",
    size: "2.3 MB",
    type: "pdf",
    color: "#ec4899",
  },
  {
    id: 10,
    name: "AWS Cloud Fundamentals",
    category: "training",
    date: "May 15, 2026",
    size: "5.8 MB",
    type: "pdf",
    color: "#ec4899",
  },
];
const DOC_CATS = [
  { id: "all", label: "All Documents", count: 10 },
  { id: "hr", label: "HR Documents", count: 3 },
  { id: "salary", label: "Salary Slips", count: 3 },
  { id: "project", label: "Project Files", count: 2 },
  { id: "training", label: "Training", count: 2 },
];
function Documents() {
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = DOCS_DATA.filter(
    (d) =>
      (activeCat === "all" || d.category === activeCat) &&
      d.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <SectionHeader
        title="Documents"
        sub="HR, salary, project and training documents"
      />
      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            width: "180px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          {DOC_CATS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                background:
                  activeCat === c.id ? "rgba(37,99,235,.1)" : "transparent",
                color: activeCat === c.id ? "#2563eb" : "var(--foreground)",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                📁 {c.label}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "1px 6px",
                  borderRadius: "999px",
                  background: "var(--muted)",
                  color: "var(--muted-foreground)",
                }}
              >
                {c.count}
              </span>
            </button>
          ))}
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 12px",
              borderRadius: "8px",
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <Search size={13} style={{ color: "var(--muted-foreground)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents…"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
              gap: "12px",
            }}
          >
            {filtered.map((doc) => (
              <div
                key={doc.id}
                style={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  padding: "16px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.boxShadow =
                    "0 4px 16px rgba(0,0,0,.08)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.boxShadow = "none")
                }
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: `${doc.color}18`,
                      color: doc.color,
                      fontSize: "18px",
                    }}
                  >
                    📄
                  </div>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      style={{
                        padding: "4px",
                        borderRadius: "6px",
                        background: "none",
                        border: "none",
                        color: "var(--muted-foreground)",
                        cursor: "pointer",
                      }}
                    >
                      👁
                    </button>
                    <button
                      style={{
                        padding: "4px",
                        borderRadius: "6px",
                        background: "none",
                        border: "none",
                        color: "var(--muted-foreground)",
                        cursor: "pointer",
                      }}
                    >
                      ⬇
                    </button>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--foreground)",
                    lineHeight: 1.4,
                    marginBottom: "6px",
                  }}
                >
                  {doc.name}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "10px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  <span>{doc.date}</span>
                  <span
                    style={{
                      textTransform: "uppercase",
                      padding: "1px 5px",
                      borderRadius: "3px",
                      background: "var(--muted)",
                    }}
                  >
                    {doc.type}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "10px",
                    color: "var(--muted-foreground)",
                    marginTop: "4px",
                  }}
                >
                  {doc.size}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Meetings ─────────────────────────────────────────────────────────────────
const MEETINGS_LIST = [
  {
    id: 1,
    title: "Daily Standup",
    date: "Today",
    time: "9:00 AM",
    dur: "15 min",
    type: "team",
    attendees: ["RK", "PS", "AM", "VG"],
    link: "https://meet.google.com/abc",
    notes: "Sprint progress & blockers.",
    actions: ["Update JIRA", "Fix auth bug"],
    status: "upcoming",
  },
  {
    id: 2,
    title: "Client Review — Mobile App",
    date: "Today",
    time: "11:00 AM",
    dur: "1 hr",
    type: "client",
    attendees: ["RK", "PS", "Client"],
    link: "https://meet.google.com/xyz",
    notes: "Q2 design showcase.",
    actions: ["Prepare demo"],
    status: "upcoming",
  },
  {
    id: 3,
    title: "Sprint Planning",
    date: "Today",
    time: "3:00 PM",
    dur: "2 hrs",
    type: "team",
    attendees: ["RK", "PS", "AM", "VG", "SK"],
    link: "",
    notes: "Plan sprint 14.",
    actions: ["Review backlog", "Estimate"],
    status: "upcoming",
  },
  {
    id: 4,
    title: "1:1 with Manager",
    date: "Jun 16",
    time: "10:00 AM",
    dur: "30 min",
    type: "1on1",
    attendees: ["RK", "PS"],
    link: "https://meet.google.com/aaa",
    notes: "Q2 performance review.",
    actions: [],
    status: "scheduled",
  },
  {
    id: 5,
    title: "Tech Architecture Review",
    date: "Jun 10",
    time: "2:00 PM",
    dur: "1.5 hrs",
    type: "team",
    attendees: ["RK", "AM", "VG"],
    link: "",
    notes: "Microservices migration plan.",
    actions: ["Document ADR"],
    status: "completed",
  },
];
const MTG_TYPE_CFG: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  team: { color: "#2563eb", bg: "rgba(37,99,235,.12)", label: "Team" },
  client: { color: "#f59e0b", bg: "rgba(245,158,11,.12)", label: "Client" },
  "1on1": { color: "#8b5cf6", bg: "rgba(139,92,246,.12)", label: "1:1" },
};
const MTG_STATUS_CFG: Record<string, { color: string; bg: string }> = {
  upcoming: { color: "#2563eb", bg: "rgba(37,99,235,.12)" },
  scheduled: { color: "#8b5cf6", bg: "rgba(139,92,246,.12)" },
  completed: { color: "#10b981", bg: "rgba(16,185,129,.12)" },
};
function Meetings() {
  const [tab, setTab] = useState<"upcoming" | "past" | "all">("upcoming");
  const [expanded, setExpand] = useState<number | null>(1);
  const [showForm, setShowForm] = useState(false);
  const filtered = MEETINGS_LIST.filter(
    (m) =>
      tab === "all" ||
      (tab === "upcoming"
        ? ["upcoming", "scheduled"].includes(m.status)
        : m.status === "completed"),
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <SectionHeader
          title="Meetings"
          sub="Schedule, notes, and action items"
        />
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            borderRadius: "8px",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            fontSize: "12px",
            cursor: "pointer",
          }}
        >
          <Plus size={13} /> Schedule Meeting
        </button>
      </div>
      {showForm && (
        <Card style={{ padding: "20px" }}>
          <p
            style={{
              fontWeight: 600,
              fontSize: "13px",
              color: "var(--foreground)",
              marginBottom: "14px",
            }}
          >
            New Meeting
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {[
              ["Title", "text", "Enter title…"],
              ["Date", "date", ""],
              ["Time", "time", ""],
              ["Duration", "text", "e.g. 1 hr"],
            ].map(([label, type, ph]) => (
              <div key={label}>
                <label
                  style={{
                    fontSize: "11px",
                    color: "var(--muted-foreground)",
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={ph}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    background: "var(--input-background)",
                    color: "var(--foreground)",
                    fontSize: "12px",
                    outline: "none",
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
            <button
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Create
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                background: "transparent",
                color: "var(--foreground)",
                border: "1px solid var(--border)",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </Card>
      )}
      <div
        style={{
          display: "flex",
          gap: "2px",
          padding: "4px",
          borderRadius: "8px",
          background: "var(--muted)",
          width: "fit-content",
        }}
      >
        {(["upcoming", "past", "all"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "6px 16px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
              background: tab === t ? "var(--card)" : "transparent",
              color:
                tab === t ? "var(--foreground)" : "var(--muted-foreground)",
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((m) => (
          <Card key={m.id} style={{ overflow: "hidden" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "12px",
                padding: "14px 18px",
                cursor: "pointer",
              }}
              onClick={() => setExpand(expanded === m.id ? null : m.id)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--muted)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <div
                style={{
                  width: "3px",
                  height: "40px",
                  borderRadius: "999px",
                  background: MTG_TYPE_CFG[m.type]?.color || "#94a3b8",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                    }}
                  >
                    {m.title}
                  </span>
                  <Badge
                    label={MTG_TYPE_CFG[m.type]?.label || m.type}
                    bg={MTG_TYPE_CFG[m.type]?.bg || "var(--muted)"}
                    color={MTG_TYPE_CFG[m.type]?.color || "#94a3b8"}
                  />
                  <Badge
                    label={m.status}
                    bg={MTG_STATUS_CFG[m.status].bg}
                    color={MTG_STATUS_CFG[m.status].color}
                  />
                </div>
                <p
                  style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
                >
                  {m.date} · {m.time} · {m.dur} · {m.attendees.length} attendees
                </p>
              </div>
              {m.status !== "completed" && m.link && (
                <a
                  href={m.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: "#10b981",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  📹 Join
                </a>
              )}
            </div>
            {expanded === m.id && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                  gap: "16px",
                  padding: "14px 18px",
                  borderTop: "1px solid var(--border)",
                  background: "var(--muted)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Attendees
                  </p>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {m.attendees.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "999px",
                          background: [
                            "#2563eb",
                            "#8b5cf6",
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                          ][i % 5],
                          color: "#fff",
                          fontSize: "10px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {a.slice(0, 2)}
                      </div>
                    ))}
                  </div>
                  {m.link && (
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--primary)",
                        marginTop: "8px",
                      }}
                    >
                      {m.link.replace("https://", "")}
                    </p>
                  )}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Notes
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--foreground)",
                      lineHeight: 1.6,
                    }}
                  >
                    {m.notes}
                  </p>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Action Items
                  </p>
                  {m.actions.length > 0 ? (
                    m.actions.map((a, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginBottom: "6px",
                          fontSize: "12px",
                          color: "var(--foreground)",
                        }}
                      >
                        <span
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "4px",
                            border: "1px solid var(--border)",
                            flexShrink: 0,
                            marginTop: "1px",
                          }}
                        />
                        {a}
                      </div>
                    ))
                  ) : (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      No action items
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Learning ─────────────────────────────────────────────────────────────────
const COURSES_DATA = [
  {
    id: 1,
    name: "React Advanced Patterns",
    provider: "Frontend Masters",
    progress: 65,
    category: "Development",
    due: "Jun 30",
    modules: 12,
    completed: 8,
  },
  {
    id: 2,
    name: "AWS Cloud Practitioner",
    provider: "AWS Training",
    progress: 40,
    category: "Cloud",
    due: "Jul 15",
    modules: 18,
    completed: 7,
  },
  {
    id: 3,
    name: "Agile & Scrum Fundamentals",
    provider: "Coursera",
    progress: 100,
    category: "Management",
    due: "Done",
    modules: 8,
    completed: 8,
  },
  {
    id: 4,
    name: "Docker & Kubernetes",
    provider: "Udemy",
    progress: 22,
    category: "DevOps",
    due: "Jul 30",
    modules: 24,
    completed: 5,
  },
  {
    id: 5,
    name: "TypeScript Masterclass",
    provider: "Scrimba",
    progress: 55,
    category: "Development",
    due: "Jun 28",
    modules: 10,
    completed: 6,
  },
  {
    id: 6,
    name: "System Design Interview",
    provider: "Educative",
    progress: 0,
    category: "Career",
    due: "Aug 15",
    modules: 20,
    completed: 0,
  },
];
const COURSE_CATS = [
  "All",
  "Development",
  "Cloud",
  "DevOps",
  "Management",
  "Career",
];
function Learning() {
  const [filterCat, setFilterCat] = useState("All");
  const filtered = COURSES_DATA.filter(
    (c) => filterCat === "All" || c.category === filterCat,
  );
  const inProgress = COURSES_DATA.filter(
    (c) => c.progress > 0 && c.progress < 100,
  ).length;
  const completed = COURSES_DATA.filter((c) => c.progress === 100).length;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <SectionHeader
        title="Learning & Development"
        sub="Track training, certifications, and skills"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
          gap: "12px",
        }}
      >
        {[
          { l: "Total Courses", v: COURSES_DATA.length, c: "#2563eb" },
          { l: "In Progress", v: inProgress, c: "#f59e0b" },
          { l: "Completed", v: completed, c: "#10b981" },
          {
            l: "Not Started",
            v: COURSES_DATA.filter((c) => c.progress === 0).length,
            c: "#94a3b8",
          },
        ].map((s) => (
          <Card key={s.l} style={{ padding: "14px" }}>
            <p
              style={{
                fontSize: "11px",
                color: "var(--muted-foreground)",
                marginBottom: "4px",
              }}
            >
              {s.l}
            </p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: s.c }}>
              {s.v}
            </p>
          </Card>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {COURSE_CATS.map((c) => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            style={{
              padding: "5px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              border: `1px solid ${filterCat === c ? "var(--primary)" : "var(--border)"}`,
              background: filterCat === c ? "var(--primary)" : "var(--card)",
              color: filterCat === c ? "#fff" : "var(--muted-foreground)",
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: "14px",
        }}
      >
        {filtered.map((c) => (
          <Card key={c.id} style={{ padding: "18px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "8px",
                  background: "rgba(37,99,235,.1)",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  flexShrink: 0,
                }}
              >
                📚
              </div>
              <Badge
                label={c.category}
                bg="var(--muted)"
                color="var(--muted-foreground)"
              />
            </div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--foreground)",
                marginBottom: "3px",
              }}
            >
              {c.name}
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "var(--muted-foreground)",
                marginBottom: "12px",
              }}
            >
              {c.provider} · {c.completed}/{c.modules} modules
            </p>
            <div style={{ marginBottom: "10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  marginBottom: "4px",
                }}
              >
                <span style={{ color: "var(--muted-foreground)" }}>
                  Progress
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    color:
                      c.progress === 100
                        ? "#10b981"
                        : c.progress > 0
                          ? "#2563eb"
                          : "#94a3b8",
                  }}
                >
                  {c.progress}%
                </span>
              </div>
              <ProgressBar
                value={c.progress}
                color={
                  c.progress === 100
                    ? "#10b981"
                    : c.progress > 0
                      ? "#2563eb"
                      : "#94a3b8"
                }
                height="6px"
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
              >
                Due: {c.due}
              </span>
              <button
                style={{
                  fontSize: "11px",
                  padding: "5px 12px",
                  borderRadius: "6px",
                  background:
                    c.progress === 100
                      ? "rgba(16,185,129,.12)"
                      : c.progress > 0
                        ? "var(--primary)"
                        : "var(--muted)",
                  color:
                    c.progress === 100
                      ? "#10b981"
                      : c.progress > 0
                        ? "#fff"
                        : "var(--muted-foreground)",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {c.progress === 100
                  ? "✓ Done"
                  : c.progress > 0
                    ? "Continue"
                    : "Start"}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Performance ──────────────────────────────────────────────────────────────
const PERF_METRICS = [
  { label: "Overall Score", value: 87, color: "#2563eb" },
  { label: "Task Completion", value: 92, color: "#10b981" },
  { label: "Code Quality", value: 95, color: "#8b5cf6" },
  { label: "Team Collaboration", value: 80, color: "#f59e0b" },
  { label: "Attendance", value: 91, color: "#0ea5e9" },
  { label: "Client Satisfaction", value: 88, color: "#ec4899" },
];
const GOALS = [
  {
    goal: "Complete AWS Certification",
    due: "Jul 30",
    progress: 40,
    status: "in-progress",
  },
  {
    goal: "Lead 2 sprint retrospectives",
    due: "Jun 30",
    progress: 50,
    status: "in-progress",
  },
  {
    goal: "Mentor junior developer",
    due: "Aug 31",
    progress: 25,
    status: "in-progress",
  },
  {
    goal: "Zero critical bugs in production",
    due: "Jun 30",
    progress: 80,
    status: "on-track",
  },
];
function Performance() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <SectionHeader
        title="Performance"
        sub="KPIs, goals, and quarterly performance review"
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
          gap: "12px",
        }}
      >
        {[
          { l: "Q2 Score", v: "87%", c: "#2563eb" },
          { l: "Rank", v: "#3 / 12", c: "#10b981" },
          { l: "Tasks Done", v: "47/52", c: "#8b5cf6" },
          { l: "Next Review", v: "Jun 30", c: "#f59e0b" },
        ].map((s) => (
          <Card key={s.l} style={{ padding: "14px" }}>
            <p
              style={{
                fontSize: "11px",
                color: "var(--muted-foreground)",
                marginBottom: "4px",
              }}
            >
              {s.l}
            </p>
            <p style={{ fontSize: "20px", fontWeight: 700, color: s.c }}>
              {s.v}
            </p>
          </Card>
        ))}
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}
      >
        <Card style={{ padding: "20px" }}>
          <p
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: "var(--foreground)",
              marginBottom: "16px",
            }}
          >
            Metrics — Q2 2026
          </p>
          {PERF_METRICS.map((m) => (
            <div key={m.label} style={{ marginBottom: "14px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span style={{ fontSize: "12px", color: "var(--foreground)" }}>
                  {m.label}
                </span>
                <span
                  style={{ fontSize: "12px", fontWeight: 700, color: m.color }}
                >
                  {m.value}%
                </span>
              </div>
              <ProgressBar value={m.value} color={m.color} height="7px" />
            </div>
          ))}
        </Card>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Card style={{ padding: "18px" }}>
            <p
              style={{
                fontWeight: 600,
                fontSize: "13px",
                color: "var(--foreground)",
                marginBottom: "12px",
              }}
            >
              Goals — Q2 2026
            </p>
            {GOALS.map((g, i) => (
              <div key={i} style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--foreground)",
                      flex: 1,
                      paddingRight: "8px",
                    }}
                  >
                    {g.goal}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                      flexShrink: 0,
                    }}
                  >
                    {g.due}
                  </span>
                </div>
                <ProgressBar
                  value={g.progress}
                  color={g.progress >= 75 ? "#10b981" : "#2563eb"}
                  height="5px"
                />
                <p
                  style={{
                    fontSize: "10px",
                    color: "var(--muted-foreground)",
                    marginTop: "2px",
                  }}
                >
                  {g.progress}%
                </p>
              </div>
            ))}
          </Card>
          <Card style={{ padding: "18px" }}>
            <p
              style={{
                fontWeight: 600,
                fontSize: "13px",
                color: "var(--foreground)",
                marginBottom: "12px",
              }}
            >
              🏆 Achievements
            </p>
            {[
              { award: "Top Performer", icon: "🏆", period: "Q1 2026" },
              { award: "Code Review Champion", icon: "⭐", period: "May 2026" },
              { award: "Sprint Hero", icon: "🚀", period: "Sprint 12" },
            ].map((a, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "7px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span style={{ fontSize: "18px" }}>{a.icon}</span>
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--foreground)",
                    }}
                  >
                    {a.award}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                    }}
                  >
                    {a.period}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────
const NOTIF_DATA = [
  {
    id: 1,
    title: "Task Due Soon",
    desc: "Homepage redesign is due tomorrow",
    time: "5m ago",
    type: "warning",
    read: false,
  },
  {
    id: 2,
    title: "Leave Approved",
    desc: "Your annual leave Jun 20-25 has been approved",
    time: "1h ago",
    type: "success",
    read: false,
  },
  {
    id: 3,
    title: "Meeting Reminder",
    desc: "Daily Standup starts in 15 minutes",
    time: "2h ago",
    type: "info",
    read: false,
  },
  {
    id: 4,
    title: "New Comment",
    desc: "Priya commented on PROJ-42 — auth bug tracker",
    time: "3h ago",
    type: "default",
    read: false,
  },
  {
    id: 5,
    title: "PR Reviewed",
    desc: "Pull request #143 approved by Ankit Mehta",
    time: "5h ago",
    type: "success",
    read: true,
  },
  {
    id: 6,
    title: "Payroll Processed",
    desc: "May 2026 salary credited to your account",
    time: "Jun 1",
    type: "success",
    read: true,
  },
  {
    id: 7,
    title: "Sprint Started",
    desc: "Sprint 14 has begun — 26 story points assigned",
    time: "Jun 10",
    type: "info",
    read: true,
  },
  {
    id: 8,
    title: "Performance Review",
    desc: "Quarterly review scheduled for Jun 30, 2026",
    time: "Jun 8",
    type: "default",
    read: true,
  },
];
const NOTIF_COLOR: Record<string, string> = {
  warning: "#f59e0b",
  success: "#10b981",
  info: "#2563eb",
  default: "#94a3b8",
};
function Notifications() {
  const [items, setItems] = useState(NOTIF_DATA);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const unreadCount = items.filter((n) => !n.read).length;
  const markAllRead = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  const displayed = filter === "unread" ? items.filter((n) => !n.read) : items;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <SectionHeader
        title="Notifications"
        sub={`${unreadCount} unread notifications`}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "2px",
            padding: "3px",
            borderRadius: "6px",
            background: "var(--muted)",
          }}
        >
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 14px",
                borderRadius: "5px",
                fontSize: "12px",
                border: "none",
                cursor: "pointer",
                background: filter === f ? "var(--card)" : "transparent",
                color:
                  filter === f
                    ? "var(--foreground)"
                    : "var(--muted-foreground)",
                textTransform: "capitalize",
              }}
            >
              {f === "unread" ? `Unread (${unreadCount})` : f}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            style={{
              fontSize: "12px",
              color: "var(--primary)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Mark all as read
          </button>
        )}
      </div>
      <Card>
        {displayed.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              padding: "40px",
              fontSize: "13px",
              color: "var(--muted-foreground)",
            }}
          >
            No notifications
          </p>
        ) : (
          displayed.map((n) => (
            <div
              key={n.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                padding: "14px 18px",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                background: !n.read ? `${NOTIF_COLOR[n.type]}06` : "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--muted)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = !n.read
                  ? `${NOTIF_COLOR[n.type]}06`
                  : "none")
              }
              onClick={() => markRead(n.id)}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "999px",
                  background: NOTIF_COLOR[n.type],
                  flexShrink: 0,
                  marginTop: "4px",
                  opacity: n.read ? 0.35 : 1,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: n.read ? 400 : 600,
                    color: "var(--foreground)",
                    marginBottom: "2px",
                  }}
                >
                  {n.title}
                </p>
                <p
                  style={{ fontSize: "12px", color: "var(--muted-foreground)" }}
                >
                  {n.desc}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "6px",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{ fontSize: "11px", color: "var(--muted-foreground)" }}
                >
                  {n.time}
                </span>
                {!n.read && (
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "999px",
                      background: NOTIF_COLOR[n.type],
                    }}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

// ─── Settings ─────────────────────────────────────────────────────────────────
function SettingsModule() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({
    name: "Rahul Kumar",
    email: "rahul@lotusprimedigitalsolutions.com",
    phone: "+91 98765 43210",
    role: "Software Developer",
    dept: "Engineering",
    bio: "Full-stack developer with 4+ years of experience.",
  });
  const [saved, setSaved] = useState(false);
  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
    { id: "notifications", label: "Notifications" },
    { id: "integrations", label: "Integrations" },
  ];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <SectionHeader
        title="Settings"
        sub="Account preferences and integrations"
      />
      <div style={{ display: "flex", gap: "20px" }}>
        <div
          style={{
            width: "180px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                textAlign: "left",
                padding: "9px 14px",
                borderRadius: "8px",
                fontSize: "12px",
                border: "none",
                cursor: "pointer",
                background:
                  activeTab === t.id ? "rgba(37,99,235,.1)" : "transparent",
                color: activeTab === t.id ? "#2563eb" : "var(--foreground)",
                fontWeight: activeTab === t.id ? 600 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          {activeTab === "profile" && (
            <Card style={{ padding: "24px" }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "var(--foreground)",
                  marginBottom: "20px",
                }}
              >
                Profile Information
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "14px",
                }}
              >
                {[
                  ["Full Name", "name", "text"],
                  ["Email", "email", "email"],
                  ["Phone", "phone", "tel"],
                  ["Role", "role", "text"],
                  ["Department", "dept", "text"],
                ].map(([label, key, type]) => (
                  <div
                    key={key}
                    style={{ gridColumn: key === "bio" ? "1 / -1" : "auto" }}
                  >
                    <label
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      value={(profile as Record<string, string>)[key]}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, [key]: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: "var(--input-background)",
                        color: "var(--foreground)",
                        fontSize: "12px",
                        outline: "none",
                      }}
                    />
                  </div>
                ))}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile((p) => ({ ...p, bio: e.target.value }))
                    }
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--input-background)",
                      color: "var(--foreground)",
                      fontSize: "12px",
                      outline: "none",
                      resize: "none",
                    }}
                  />
                </div>
              </div>
              <button
                onClick={save}
                style={{
                  marginTop: "16px",
                  padding: "9px 20px",
                  borderRadius: "8px",
                  background: saved ? "#10b981" : "var(--primary)",
                  color: "#fff",
                  border: "none",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                {saved ? "✓ Saved!" : "Save Changes"}
              </button>
            </Card>
          )}
          {activeTab === "security" && (
            <Card style={{ padding: "24px" }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "var(--foreground)",
                  marginBottom: "20px",
                }}
              >
                Security Settings
              </p>
              {[
                { label: "Current Password", ph: "Enter current password" },
                { label: "New Password", ph: "Enter new password" },
                { label: "Confirm Password", ph: "Confirm new password" },
              ].map((f) => (
                <div key={f.label} style={{ marginBottom: "14px" }}>
                  <label
                    style={{
                      fontSize: "11px",
                      color: "var(--muted-foreground)",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    {f.label}
                  </label>
                  <input
                    type="password"
                    placeholder={f.ph}
                    style={{
                      width: "100%",
                      padding: "9px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                      background: "var(--input-background)",
                      color: "var(--foreground)",
                      fontSize: "12px",
                      outline: "none",
                    }}
                  />
                </div>
              ))}
              <button
                style={{
                  padding: "9px 20px",
                  borderRadius: "8px",
                  background: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                Update Password
              </button>
              <div
                style={{
                  marginTop: "24px",
                  paddingTop: "20px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "13px",
                    color: "var(--foreground)",
                    marginBottom: "12px",
                  }}
                >
                  Two-Factor Authentication
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p style={{ fontSize: "12px", color: "var(--foreground)" }}>
                      Authenticator App
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      Not enabled
                    </p>
                  </div>
                  <button
                    style={{
                      padding: "7px 14px",
                      borderRadius: "8px",
                      background: "var(--muted)",
                      border: "none",
                      fontSize: "12px",
                      cursor: "pointer",
                      color: "var(--foreground)",
                    }}
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>
            </Card>
          )}
          {activeTab === "notifications" && (
            <Card style={{ padding: "24px" }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "var(--foreground)",
                  marginBottom: "20px",
                }}
              >
                Notification Preferences
              </p>
              {[
                ["Task reminders", "Get notified 1 hour before task deadlines"],
                ["Meeting alerts", "15-minute reminder before meetings"],
                ["Leave approvals", "When your leave is approved or rejected"],
                ["Payroll alerts", "When salary is credited"],
                ["Performance reviews", "Quarterly review reminders"],
                ["New comments", "When someone comments on your tasks"],
              ].map(([label, desc]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "var(--foreground)",
                      }}
                    >
                      {label}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {desc}
                    </p>
                  </div>
                  <div
                    style={{
                      width: "38px",
                      height: "22px",
                      borderRadius: "999px",
                      background: "#10b981",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        right: "3px",
                        top: "3px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "999px",
                        background: "#fff",
                      }}
                    />
                  </div>
                </div>
              ))}
            </Card>
          )}
          {activeTab === "integrations" && (
            <Card style={{ padding: "24px" }}>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "var(--foreground)",
                  marginBottom: "20px",
                }}
              >
                Connected Integrations
              </p>
              {[
                {
                  name: "Google Calendar",
                  desc: "Sync meetings and events",
                  connected: true,
                },
                {
                  name: "Slack",
                  desc: "Receive notifications in Slack",
                  connected: true,
                },
                {
                  name: "GitHub",
                  desc: "Track code commits and PRs",
                  connected: false,
                },
                { name: "Figma", desc: "Design file access", connected: false },
              ].map((i) => (
                <div
                  key={i.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                      }}
                    >
                      {i.name}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-foreground)",
                      }}
                    >
                      {i.desc}
                    </p>
                  </div>
                  <button
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      background: i.connected
                        ? "rgba(16,185,129,.12)"
                        : "var(--muted)",
                      color: i.connected
                        ? "#10b981"
                        : "var(--muted-foreground)",
                      border: `1px solid ${i.connected ? "rgba(16,185,129,.3)" : "var(--border)"}`,
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {i.connected ? "✓ Connected" : "Connect"}
                  </button>
                </div>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AI Assistant ─────────────────────────────────────────────────────────────
const AI_SUGGESTIONS = [
  { text: "What tasks are due this week?", color: "#2563eb" },
  { text: "Summarize today's meetings", color: "#8b5cf6" },
  { text: "Show my performance insights", color: "#10b981" },
  { text: "Summarize project statuses", color: "#f59e0b" },
];
const AI_RESPONSES: Record<string, string> = {
  task: "📋 You have **12 open tasks** this week:\n• 3 due today — including the critical auth bug\n• 4 In Progress, 2 Blocked",
  meeting:
    "📅 **3 meetings today:**\n1. Daily Standup 9:00 AM\n2. Client Review 11:00 AM\n3. Sprint Planning 3:00 PM",
  performance:
    "📊 **Your performance this month:**\n• Overall Score: 87% (+2%)\n• Code Quality: A+\n• Sprint Velocity: 82%",
  project:
    "🗂 **Project summary:**\n• Mobile App — 78% On Track\n• CRM Integration — 45% At Risk ⚠️\n• Analytics — 92% On Track",
};
interface Msg {
  role: "user" | "ai";
  text: string;
  time: string;
}

function AIAssistant() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: "Hi! 👋 I'm your AI assistant. Ask me about tasks, meetings, performance, or projects.",
      time: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setTyping] = useState(false);
  const send = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMsgs((prev) => [...prev, { role: "user", text, time: now }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply =
        "I can help with tasks, meetings, performance, and projects. Try asking one of the quick prompts!";
      for (const [k, v] of Object.entries(AI_RESPONSES)) {
        if (lower.includes(k)) {
          reply = v;
          break;
        }
      }
      setMsgs((prev) => [
        ...prev,
        {
          role: "ai",
          text: reply,
          time: new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setTyping(false);
    }, 1200);
  };
  const renderText = (text: string) =>
    text.split("\n").map((line, i) => (
      <p
        key={i}
        style={{ marginBottom: "3px", lineHeight: 1.6 }}
        dangerouslySetInnerHTML={{
          __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
        }}
      />
    ));
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <SectionHeader
        title="AI Assistant"
        sub="Powered by Lotus Prime AI — your intelligent work companion"
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          background: "var(--card)",
          overflow: "hidden",
          height: "520px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            background: "var(--muted)",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "999px",
              background: "linear-gradient(135deg,#2563eb,#8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bot size={16} color="#fff" />
          </div>
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--foreground)",
              }}
            >
              Lotus AI
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background: "#10b981",
                }}
              />
              <span
                style={{ fontSize: "10px", color: "var(--muted-foreground)" }}
              >
                Online
              </span>
            </div>
          </div>
          <button
            style={{
              marginLeft: "auto",
              padding: "4px",
              background: "none",
              border: "none",
              color: "var(--muted-foreground)",
              cursor: "pointer",
            }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {msgs.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "8px",
                flexDirection: m.role === "user" ? "row-reverse" : "row",
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "999px",
                  flexShrink: 0,
                  marginTop: "2px",
                  background:
                    m.role === "ai"
                      ? "linear-gradient(135deg,#2563eb,#8b5cf6)"
                      : "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {m.role === "ai" ? (
                  <Bot size={12} color="#fff" />
                ) : (
                  <span
                    style={{ color: "#fff", fontSize: "9px", fontWeight: 700 }}
                  >
                    LP
                  </span>
                )}
              </div>
              <div
                style={{
                  maxWidth: "78%",
                  padding: "10px 14px",
                  borderRadius:
                    m.role === "user"
                      ? "12px 4px 12px 12px"
                      : "4px 12px 12px 12px",
                  background:
                    m.role === "user" ? "var(--primary)" : "var(--muted)",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: m.role === "user" ? "#fff" : "var(--foreground)",
                  }}
                >
                  {renderText(m.text)}
                </div>
                <p
                  style={{
                    fontSize: "10px",
                    marginTop: "4px",
                    color:
                      m.role === "user"
                        ? "rgba(255,255,255,.55)"
                        : "var(--muted-foreground)",
                  }}
                >
                  {m.time}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: "flex", gap: "8px" }}>
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg,#2563eb,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bot size={12} color="#fff" />
              </div>
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "4px 12px 12px 12px",
                  background: "var(--muted)",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center",
                }}
              >
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "999px",
                      background: "#3b82f6",
                      display: "inline-block",
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            padding: "8px 12px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
          }}
        >
          {AI_SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => send(s.text)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "11px",
                border: `1px solid ${s.color}30`,
                color: s.color,
                background: `${s.color}10`,
                cursor: "pointer",
              }}
            >
              {s.text}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "10px 12px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask anything about your work…"
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "12px",
              border: "1px solid var(--border)",
              background: "var(--input-background)",
              color: "var(--foreground)",
              outline: "none",
            }}
          />
          <button
            onClick={() => send(input)}
            style={{
              padding: "8px 10px",
              borderRadius: "8px",
              background: input.trim() ? "var(--primary)" : "var(--muted)",
              color: input.trim() ? "#fff" : "var(--muted-foreground)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Panel (employees table) ───────────────────────────────────────────
const EMPLOYEES = [
  {
    id: "EMP001",
    name: "Rahul Kumar",
    role: "Software Developer",
    dept: "Engineering",
    status: "active",
    joined: "Mar 1, 2024",
    salary: "₹85,000",
  },
  {
    id: "EMP002",
    name: "Priya Sharma",
    role: "Project Manager",
    dept: "PMO",
    status: "active",
    joined: "Jan 15, 2023",
    salary: "₹1,10,000",
  },
  {
    id: "EMP003",
    name: "Ankit Mehta",
    role: "QA Tester",
    dept: "Quality",
    status: "active",
    joined: "Jun 10, 2024",
    salary: "₹65,000",
  },
  {
    id: "EMP004",
    name: "Sneha Patel",
    role: "UI/UX Designer",
    dept: "Design",
    status: "active",
    joined: "Sep 5, 2023",
    salary: "₹78,000",
  },
  {
    id: "EMP005",
    name: "Vikram Gupta",
    role: "Digital Marketing",
    dept: "Marketing",
    status: "active",
    joined: "Feb 20, 2024",
    salary: "₹72,000",
  },
  {
    id: "EMP006",
    name: "Kavya Reddy",
    role: "Sales Executive",
    dept: "Sales",
    status: "on-leave",
    joined: "Nov 8, 2023",
    salary: "₹68,000",
  },
  {
    id: "EMP007",
    name: "Sameer Khan",
    role: "Video Editor",
    dept: "Creative",
    status: "active",
    joined: "Apr 1, 2024",
    salary: "₹62,000",
  },
];
const EMP_STATUS: Record<string, { bg: string; text: string }> = {
  active: { bg: "rgba(16,185,129,.12)", text: "#10b981" },
  "on-leave": { bg: "rgba(245,158,11,.12)", text: "#f59e0b" },
  inactive: { bg: "rgba(148,163,184,.12)", text: "#94a3b8" },
};

function AdminPanel() {
  const [search, setSearch] = useState("");
  const filtered = EMPLOYEES.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <SectionHeader
          title="Admin Panel"
          sub="Manage employees, roles, payroll, and more"
        />
        <Badge label="Super Admin" bg="rgba(239,68,68,.12)" color="#ef4444" />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
          gap: "12px",
        }}
      >
        {[
          { label: "Total Employees", value: "38", color: "#2563eb" },
          { label: "Active Today", value: "31", color: "#10b981" },
          { label: "On Leave", value: "4", color: "#f59e0b" },
          { label: "Open Positions", value: "6", color: "#8b5cf6" },
        ].map((s) => (
          <Card key={s.label} style={{ padding: "14px" }}>
            <p
              style={{
                fontSize: "11px",
                color: "var(--muted-foreground)",
                marginBottom: "4px",
              }}
            >
              {s.label}
            </p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>
              {s.value}
            </p>
          </Card>
        ))}
      </div>
      <Card style={{ overflowX: "auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid var(--border)",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 12px",
              borderRadius: "8px",
              background: "var(--muted)",
              flex: 1,
              minWidth: "200px",
            }}
          >
            <Search size={13} style={{ color: "var(--muted-foreground)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees…"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: "12px",
                color: "var(--foreground)",
              }}
            />
          </div>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "8px",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <Plus size={13} /> Add Employee
          </button>
        </div>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "720px",
          }}
        >
          <thead>
            <tr style={{ background: "var(--muted)" }}>
              {[
                "ID",
                "Name",
                "Role",
                "Department",
                "Status",
                "Joined",
                "Salary",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr
                key={emp.id}
                style={{ borderBottom: "1px solid var(--border)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--muted)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <td
                  style={{
                    padding: "10px 14px",
                    fontSize: "10px",
                    fontFamily: "monospace",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {emp.id}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "999px",
                        background: "var(--primary)",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {emp.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "var(--foreground)",
                      }}
                    >
                      {emp.name}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    padding: "10px 14px",
                    fontSize: "12px",
                    color: "var(--foreground)",
                  }}
                >
                  {emp.role}
                </td>
                <td
                  style={{
                    padding: "10px 14px",
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {emp.dept}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <Badge
                    label={emp.status.replace("-", " ")}
                    bg={EMP_STATUS[emp.status]?.bg}
                    color={EMP_STATUS[emp.status]?.text}
                  />
                </td>
                <td
                  style={{
                    padding: "10px 14px",
                    fontSize: "12px",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {emp.joined}
                </td>
                <td
                  style={{
                    padding: "10px 14px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#10b981",
                  }}
                >
                  {emp.salary}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      style={{
                        padding: "4px",
                        borderRadius: "4px",
                        background: "none",
                        border: "none",
                        color: "var(--muted-foreground)",
                        cursor: "pointer",
                      }}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      style={{
                        padding: "4px",
                        borderRadius: "4px",
                        background: "none",
                        border: "none",
                        color: "#ef4444",
                        cursor: "pointer",
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Role Dashboard ───────────────────────────────────────────────────────────
const ROLE_LIST = [
  { id: "developer", label: "Software Developer", icon: <Code2 size={13} /> },
  { id: "qa", label: "QA Tester", icon: <Bug size={13} /> },
  { id: "designer", label: "UI/UX Designer", icon: <Palette size={13} /> },
  { id: "video", label: "Video Editor", icon: <Video size={13} /> },
  { id: "social", label: "Social Media", icon: <Instagram size={13} /> },
  {
    id: "marketing",
    label: "Digital Marketing",
    icon: <TrendingUp size={13} />,
  },
  { id: "sales", label: "Sales Executive", icon: <DollarSign size={13} /> },
  { id: "pm", label: "Project Manager", icon: <FolderKanban size={13} /> },
];
function RoleDashboard() {
  const [activeRole, setActiveRole] = useState("developer");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        paddingBottom: "24px",
      }}
    >
      <SectionHeader
        title="Role Dashboards"
        sub="Role-specific KPIs, tools, and workflow views"
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {ROLE_LIST.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveRole(r.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 500,
              border: `1px solid ${activeRole === r.id ? "var(--primary)" : "var(--border)"}`,
              background:
                activeRole === r.id ? "var(--primary)" : "var(--card)",
              color: activeRole === r.id ? "#fff" : "var(--muted-foreground)",
              cursor: "pointer",
            }}
          >
            {r.icon} {r.label}
          </button>
        ))}
      </div>
      <Card style={{ padding: "32px", textAlign: "center" }}>
        <p style={{ fontSize: "32px", marginBottom: "8px" }}>
          {activeRole === "developer"
            ? "💻"
            : activeRole === "qa"
              ? "🐛"
              : activeRole === "designer"
                ? "🎨"
                : activeRole === "video"
                  ? "🎬"
                  : activeRole === "social"
                    ? "📱"
                    : activeRole === "marketing"
                      ? "📊"
                      : activeRole === "sales"
                        ? "💰"
                        : "📋"}
        </p>
        <p
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--foreground)",
            marginBottom: "8px",
          }}
        >
          {ROLE_LIST.find((r) => r.id === activeRole)?.label} Dashboard
        </p>
        <p style={{ fontSize: "12px", color: "var(--muted-foreground)" }}>
          Connect to Supabase to load live role-specific KPIs, projects, and
          metrics.
        </p>
      </Card>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState<ActivePage>("dashboard");
  const [isDark, setIsDark] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDark = () => {
    setIsDark((d) => !d);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/employee/login");
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard onNavigate={setActivePage} />;
      case "projects":
        return (
          <Projects
            onNavigateTasks={(project) => {
              setActivePage("tasks");
            }}
          />
        );
      case "tasks":
        return <MyTasks />;
      case "my-work":
        return <MyWork onNavigate={setActivePage} />;
      case "timesheet":
        return <Timesheet />;
      case "attendance":
        return <Attendance />;
      case "leave":
        return <LeaveManagement />;
      case "clients":
        return <Clients />;
      case "documents":
        return <Documents />;
      case "meetings":
        return <Meetings />;
      case "learning":
        return <Learning />;
      case "performance":
        return <Performance />;
      case "notifications":
        return <Notifications />;
      case "settings":
        return <SettingsModule />;
      case "admin":
        return <AdminPanel />;
      case "ai-assistant":
        return <AIAssistant />;
      case "role-dashboard":
        return <RoleDashboard />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          background: "var(--background)",
        }}
      >
        <Sidebar
          activePage={activePage}
          onNavigate={setActivePage}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          onLogout={handleLogout}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <TopNav
            activePage={activePage}
            isDark={isDark}
            onToggleDark={toggleDark}
            onMobileMenu={() => setMobileOpen(true)}
            onNavigate={setActivePage}
          />
          <main style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
              {renderPage()}
            </div>
          </main>
        </div>
        {activePage !== "ai-assistant" && (
          <button
            onClick={() => setActivePage("ai-assistant")}
            title="Open AI Assistant"
            style={{
              position: "fixed",
              bottom: "24px",
              right: "24px",
              width: "48px",
              height: "48px",
              borderRadius: "999px",
              background: "linear-gradient(135deg,#2563eb,#8b5cf6)",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(37,99,235,.4)",
              zIndex: 40,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🤖
          </button>
        )}
      </div>
    </>
  );
}
