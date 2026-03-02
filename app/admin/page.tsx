import { readFileSync } from "fs";
import path from "path";
import Link from "next/link";
import AdminForm from "@/components/AdminForm";
import AdminLoginGate, { LogoutButton } from "@/components/AdminLoginGate";

interface SiteLink {
  label: string;
  url: string;
}

interface Section {
  title: string;
  start_time: string;
  end_time: string;
  links: SiteLink[];
  is_open?: boolean;
  use_schedule?: boolean;
}

interface Settings {
  university_tamil_name: string;
  university_english_name: string;
  ranking_text: string;
  address: string;
  logo: string;
  right_image: string;
  exam_title: string;
  session_open_time: string;
  exam_start_time: string;
  exam_end_time: string;
  sections: Section[];
}

function getSettings(): Settings {
  const file = path.join(process.cwd(), "data", "site-settings.json");
  const raw = readFileSync(file, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as Settings;
}

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const settings = getSettings();

  return (
    <AdminLoginGate>
      <div className="min-h-screen" style={{ background: "#f1f5f9" }}>
        {/* Top Bar */}
        <div
          className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 shadow-md"
          style={{ background: "#0a2a6e" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">
                Admin Dashboard
              </p>
              <p className="text-xs" style={{ color: "#93c5fd" }}>
                {settings.university_english_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer hover:opacity-80"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View Live Site
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Main */}
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-8 pb-24">
          {/* Page heading */}
          <div className="mb-6 flex items-center gap-3">
            <div
              className="w-1 h-8 rounded-full shrink-0"
              style={{ background: "#0a2a6e" }}
            />
            <div>
              <h1
                className="text-xl font-extrabold"
                style={{ color: "#0a2a6e" }}
              >
                Site Settings
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                Edit content below and click <strong>Save Settings</strong>.
                Changes reflect on next client page load.
              </p>
            </div>
          </div>

          <AdminForm initial={settings} />
        </div>
      </div>
    </AdminLoginGate>
  );
}
