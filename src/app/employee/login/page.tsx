"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowLeft } from "lucide-react";

export default function EmployeeLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/employee");
      router.refresh();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f1729 0%, #1e2a4a 50%, #0f1729 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        position: "relative",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Back to Home */}
      <Link
        href="/"
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "rgba(203,213,225,.7)",
          textDecoration: "none",
          fontSize: "14px",
          transition: "color .2s",
        }}
        onMouseEnter={(e) =>
          ((e.target as HTMLElement).closest("a")!.style.color = "#fff")
        }
        onMouseLeave={(e) =>
          ((e.target as HTMLElement).closest("a")!.style.color =
            "rgba(203,213,225,.7)")
        }
      >
        <ArrowLeft size={16} /> Back to Home
      </Link>

      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              display: "inline-block",
              background: "#fff",
              borderRadius: "16px",
              padding: "12px 16px",
              marginBottom: "16px",
              boxShadow: "0 20px 40px rgba(0,0,0,.3)",
            }}
          >
            <img
              src="/LP%20Logo%20Vector.svg"
              alt="Lotus Prime Digital Solutions"
              style={{ height: "52px", width: "auto", display: "block" }}
            />
          </div>
          <h1
            style={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: 700,
              margin: "0 0 4px",
            }}
          >
            Employee Portal
          </h1>
          <p
            style={{
              color: "rgba(148,163,184,.8)",
              fontSize: "13px",
              margin: 0,
            }}
          >
            Sign in to access your workspace
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#111827",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 25px 50px rgba(0,0,0,.4)",
            border: "1px solid rgba(255,255,255,.08)",
          }}
        >
          <h2
            style={{
              color: "#e2e8f0",
              fontSize: "18px",
              fontWeight: 600,
              margin: "0 0 24px",
            }}
          >
            Welcome back
          </h2>

          {error && (
            <div
              style={{
                background: "rgba(220,38,38,.12)",
                border: "1px solid rgba(220,38,38,.3)",
                color: "#fca5a5",
                fontSize: "13px",
                borderRadius: "8px",
                padding: "10px 14px",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#94a3b8",
                  marginBottom: "6px",
                }}
              >
                Email address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={14}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="employee@lotusprimedigitalsolutions.com"
                  style={{
                    width: "100%",
                    paddingLeft: "36px",
                    paddingRight: "12px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    background: "#1e293b",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#e2e8f0",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,.1)")
                  }
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#94a3b8",
                  marginBottom: "6px",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={14}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#64748b",
                  }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    paddingLeft: "36px",
                    paddingRight: "40px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    background: "#1e293b",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    color: "#e2e8f0",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,.1)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: loading ? "rgba(37,99,235,.6)" : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background .2s",
              }}
            >
              {loading && (
                <Loader2
                  size={15}
                  style={{ animation: "spin 1s linear infinite" }}
                />
              )}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: "#475569",
              marginTop: "24px",
            }}
          >
            Lotus Prime Digital Solutions © {new Date().getFullYear()}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: #475569; }
      `}</style>
    </div>
  );
}
