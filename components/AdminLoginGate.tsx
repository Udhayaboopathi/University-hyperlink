"use client";

import { useState, useEffect, ReactNode } from "react";
import Alert from "@/components/Alert";

const STORAGE_KEY = "admin_auth";
const CORRECT_PASSWORD = "admin@123";

export default function AdminLoginGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    const val = sessionStorage.getItem(STORAGE_KEY);
    if (val === "yes") setAuthed(true);
    setChecked(true);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "yes");
      setAuthed(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setPassword("");
  }

  if (!checked) return null;

  if (!authed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background:
            "linear-gradient(135deg, #0a2a6e 0%, #1d4ed8 50%, #0a2a6e 100%)",
        }}
      >
        <div className="w-full max-w-sm">
          {/* Logo card */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-wide">
              Admin Panel
            </h1>
            <p className="text-blue-200 text-sm mt-1">
              University Portal Management
            </p>
          </div>

          {/* Login card */}
          <div
            className="rounded-2xl p-8 shadow-2xl"
            style={{ background: "#ffffff" }}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">Sign In</h2>
            <p className="text-xs text-gray-400 mb-6">
              Enter your admin password to continue
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    autoFocus
                    className="w-full border rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    style={{ borderColor: error ? "#fca5a5" : "#e2e8f0" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPw ? (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {error && (
                  <Alert
                    type="error"
                    title="Incorrect Password"
                    message={error}
                    onClose={() => setError("")}
                  />
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-all shadow cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #0a2a6e, #1d4ed8)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #1e3a8a, #2563eb)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(10,42,110,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg, #0a2a6e, #1d4ed8)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Place this inside the admin top bar
export function LogoutButton() {
  function handleLogout() {
    sessionStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
      style={{
        background: "rgba(254,226,226,0.15)",
        color: "#fca5a5",
        border: "1px solid rgba(252,165,165,0.4)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
        (e.currentTarget as HTMLButtonElement).style.color = "#b91c1c";
        (e.currentTarget as HTMLButtonElement).style.border =
          "1px solid #fca5a5";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(254,226,226,0.15)";
        (e.currentTarget as HTMLButtonElement).style.color = "#fca5a5";
        (e.currentTarget as HTMLButtonElement).style.border =
          "1px solid rgba(252,165,165,0.4)";
      }}
      title="Logout from admin"
    >
      <svg
        className="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
        />
      </svg>
      Logout
    </button>
  );
}
