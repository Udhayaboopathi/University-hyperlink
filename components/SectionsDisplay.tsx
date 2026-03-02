"use client";

import { useState, useEffect } from "react";

interface SiteLink {
  label: string;
  url: string;
}

export interface Section {
  title: string;
  start_time: string; // "HH:MM"
  end_time: string; // "HH:MM"
  links: SiteLink[];
  is_open?: boolean; // false = hidden from client page
  use_schedule?: boolean; // false = always active (no time gate)
}

type SectionStatus = "active" | "upcoming" | "closed";

function getMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

// Always returns current time in IST (UTC+5:30) regardless of client timezone.
function nowIST(): { hours: number; minutes: number; seconds: number } {
  const ist = new Date(Date.now() + 5.5 * 3600 * 1000);
  return {
    hours: ist.getUTCHours(),
    minutes: ist.getUTCMinutes(),
    seconds: ist.getUTCSeconds(),
  };
}

function nowMinutes(): number {
  const { hours, minutes } = nowIST();
  return hours * 60 + minutes;
}

function getStatus(start: string, end: string): SectionStatus {
  const now = nowMinutes();
  const s = getMinutes(start);
  const e = getMinutes(end);
  if (now >= s && now < e) return "active";
  if (now < s) return "upcoming";
  return "closed";
}

function to12(hhmm: string): string {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

function secsUntil(hhmm: string): number {
  const { hours, minutes, seconds } = nowIST();
  const [th, tm] = hhmm.split(":").map(Number);
  const nowSecs = hours * 3600 + minutes * 60 + seconds;
  const targetSecs = th * 3600 + tm * 60;
  return Math.max(0, targetSecs - nowSecs);
}

function fmtSecs(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0)
    return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  return `${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

function SectionCard({ section }: { section: Section }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // if time scheduling is off, always treat as active
  const alwaysOpen = section.use_schedule === false;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const status: SectionStatus = alwaysOpen
    ? "active"
    : getStatus(section.start_time, section.end_time);
  const countdown = alwaysOpen ? 0 : secsUntil(section.start_time);

  // suppress unused warning for tick
  void tick;

  const accent =
    status === "active"
      ? "#0a2a6e"
      : status === "upcoming"
        ? "#b45309"
        : "#94a3b8";

  return (
    <div
      className="rounded-xl overflow-hidden flex transition-all"
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow:
          status === "active"
            ? "0 2px 12px rgba(10,42,110,0.10)"
            : "0 1px 4px rgba(0,0,0,0.05)",
        opacity: status === "closed" ? 0.6 : 1,
      }}
    >
      {/* Left accent bar */}
      <div className="w-1.5 shrink-0" style={{ background: accent }} />

      {/* Content */}
      <div className="flex-1 min-w-0 px-5 py-4">
        {/* Top row: title + badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3
              className="font-extrabold uppercase leading-tight truncate"
              style={{
                color: "#0a2a6e",
                fontSize: "clamp(0.8rem, 1.4vw, 0.95rem)",
                letterSpacing: "0.05em",
              }}
            >
              {section.title}
            </h3>
            {!alwaysOpen && (
              <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                {to12(section.start_time)} &ndash; {to12(section.end_time)}
              </p>
            )}
          </div>

          {/* Status badge */}
          {status === "active" && (
            <span
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded"
              style={{
                background: "#f0fdf4",
                color: "#15803d",
                border: "1px solid #bbf7d0",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              OPEN
            </span>
          )}
          {status === "upcoming" && (
            <div className="shrink-0 text-right">
              <span
                className="inline-block text-xs font-bold px-3 py-1 rounded"
                style={{
                  background: "#fffbeb",
                  color: "#b45309",
                  border: "1px solid #fde68a",
                }}
              >
                {fmtSecs(countdown)}
              </span>
              <p className="text-xs mt-0.5" style={{ color: "#b45309" }}>
                Opens {to12(section.start_time)}
              </p>
            </div>
          )}
          {status === "closed" && (
            <span
              className="shrink-0 inline-block text-xs font-bold px-3 py-1 rounded"
              style={{
                background: "#f8fafc",
                color: "#94a3b8",
                border: "1px solid #e2e8f0",
              }}
            >
              CLOSED
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="mb-3 h-px" style={{ background: "#f1f5f9" }} />

        {/* Links */}
        <div className="flex flex-wrap gap-2">
          {section.links.map((link, i) =>
            status === "active" ? (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-md transition-all duration-150"
                style={{
                  background: "#0a2a6e",
                  color: "#ffffff",
                  border: "1px solid #0a2a6e",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "#1d4ed8";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "#1d4ed8";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "#0a2a6e";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "#0a2a6e";
                }}
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
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
                {link.label}
              </a>
            ) : (
              <span
                key={i}
                title={
                  status === "upcoming"
                    ? `Opens at ${to12(section.start_time)}`
                    : "Session closed"
                }
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-md cursor-not-allowed select-none"
                style={{
                  background: "#f8fafc",
                  color: "#cbd5e1",
                  border: "1px solid #e2e8f0",
                }}
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
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
                {link.label}
              </span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default function SectionsDisplay({ sections }: { sections: Section[] }) {
  const [, setTick] = useState(0);

  // re-render every minute so sort order updates when a section opens
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // only show sections that are open (is_open defaults to true)
  const visible = sections.filter((s) => s.is_open !== false);

  if (!visible || visible.length === 0) return null;

  const order: Record<SectionStatus, number> = {
    active: 0,
    upcoming: 1,
    closed: 2,
  };

  const sorted = [...visible].sort((a, b) => {
    const sa =
      a.use_schedule === false ? 0 : order[getStatus(a.start_time, a.end_time)];
    const sb =
      b.use_schedule === false ? 0 : order[getStatus(b.start_time, b.end_time)];
    if (sa !== sb) return sa - sb;
    return getMinutes(a.start_time) - getMinutes(b.start_time);
  });

  return (
    <div>
      {/* Section Heading */}

      <div className="flex flex-col gap-3">
        {sorted.map((section, i) => (
          <SectionCard key={i} section={section} />
        ))}
      </div>
    </div>
  );
}
