"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import Alert from "@/components/Alert";

interface SiteLink {
  label: string;
  url: string;
}

interface Section {
  title: string;
  start_time: string;
  end_time: string;
  links: SiteLink[];
  is_open?: boolean; // false = hidden from client page
  use_schedule?: boolean; // false = always active
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

interface AdminFormProps {
  initial: Settings;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {children}
    </label>
  );
}

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 placeholder-gray-400";

const textareaCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800 resize-none placeholder-gray-400";

function SectionCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div
        className="px-6 py-3 flex items-center gap-2"
        style={{ background: "#0a2a6e", borderBottom: "1px solid #1d4ed8" }}
      >
        <h2
          className="text-sm font-bold tracking-wide uppercase"
          style={{ color: "#ffffff" }}
        >
          {label}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function AdminForm({ initial }: AdminFormProps) {
  const [form, setForm] = useState<Settings>({
    ...initial,
    sections: (initial.sections ?? []).map((s) => ({
      ...s,
      is_open: s.is_open ?? true,
      use_schedule: s.use_schedule ?? false,
    })),
  });
  const [logoPreview, setLogoPreview] = useState<string>(initial.logo);
  const [portraitPreview, setPortraitPreview] = useState<string>(
    initial.right_image,
  );
  const [saving, setSaving] = useState(false);
  const [saveHover, setSaveHover] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const logoRef = useRef<HTMLInputElement>(null);
  const portraitRef = useRef<HTMLInputElement>(null);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFilePreview(
    e: ChangeEvent<HTMLInputElement>,
    setPreview: (s: string) => void,
  ) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  // ── Section helpers ─────────────────────────────────────────────────────────
  function addSection() {
    setForm((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: "",
          start_time: "09:00",
          end_time: "17:00",
          links: [],
          is_open: true,
          use_schedule: false,
        },
      ],
    }));
  }

  function removeSection(si: number) {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== si),
    }));
  }

  function updateSection(si: number, key: keyof Section, value: string) {
    setForm((prev) => {
      const sections = [...prev.sections];
      sections[si] = { ...sections[si], [key]: value };
      return { ...prev, sections };
    });
  }

  function toggleSectionBool(si: number, key: "is_open" | "use_schedule") {
    setForm((prev) => {
      const sections = [...prev.sections];
      sections[si] = { ...sections[si], [key]: !sections[si][key] };
      return { ...prev, sections };
    });
  }

  function addLink(si: number) {
    setForm((prev) => {
      const sections = [...prev.sections];
      sections[si] = {
        ...sections[si],
        links: [...sections[si].links, { label: "", url: "" }],
      };
      return { ...prev, sections };
    });
  }

  function removeLink(si: number, li: number) {
    setForm((prev) => {
      const sections = [...prev.sections];
      sections[si] = {
        ...sections[si],
        links: sections[si].links.filter((_, i) => i !== li),
      };
      return { ...prev, sections };
    });
  }

  function updateLink(
    si: number,
    li: number,
    key: "label" | "url",
    value: string,
  ) {
    setForm((prev) => {
      const sections = [...prev.sections];
      const links = [...sections[si].links];
      links[li] = { ...links[li], [key]: value };
      sections[si] = { ...sections[si], links };
      return { ...prev, sections };
    });
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const fd = new FormData();
      fd.append("university_tamil_name", form.university_tamil_name);
      fd.append("university_english_name", form.university_english_name);
      fd.append("ranking_text", form.ranking_text);
      fd.append("address", form.address);
      fd.append("exam_title", form.exam_title);
      fd.append("session_open_time", form.session_open_time);
      fd.append("exam_start_time", form.exam_start_time);
      fd.append("exam_end_time", form.exam_end_time);
      fd.append("sections", JSON.stringify(form.sections));

      if (logoRef.current?.files?.[0])
        fd.append("logo", logoRef.current.files[0]);
      if (portraitRef.current?.files?.[0])
        fd.append("right_image", portraitRef.current.files[0]);

      const res = await fetch("/api/settings", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");

      setMessage({
        type: "success",
        text: "Settings saved! Refresh the client page to see changes.",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setMessage({ type: "error", text: `Error: ${msg}` });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* University Info */}
      <SectionCard label="University Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FieldLabel>University Tamil Name</FieldLabel>
            <input
              type="text"
              name="university_tamil_name"
              value={form.university_tamil_name}
              onChange={handleChange}
              className={inputCls}
              placeholder="பெரியார் பல்கலைக்கழகம்"
            />
          </div>
          <div>
            <FieldLabel>University English Name</FieldLabel>
            <input
              type="text"
              name="university_english_name"
              value={form.university_english_name}
              onChange={handleChange}
              className={inputCls}
              placeholder="PERIYAR UNIVERSITY"
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Ranking Text</FieldLabel>
            <textarea
              name="ranking_text"
              value={form.ranking_text}
              onChange={handleChange}
              className={textareaCls}
              rows={3}
              placeholder="State University - NAAC A++ Grade..."
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Address</FieldLabel>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className={textareaCls}
              rows={2}
              placeholder="Salem - 636011, Tamil Nadu, India"
            />
          </div>
        </div>
      </SectionCard>

      {/* Images */}
      <SectionCard label="Images">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FieldLabel>University Logo</FieldLabel>
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo"
                className="w-20 h-20 object-contain mb-3 rounded-xl p-1"
                style={{ border: "1px solid #e2e8f0", background: "#f8fafc" }}
              />
            )}
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFilePreview(e, setLogoPreview)}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
          <div>
            <FieldLabel>Right Image (Dept. Logo)</FieldLabel>
            {portraitPreview && (
              <img
                src={portraitPreview}
                alt="Right"
                className="w-20 h-20 object-contain mb-3 rounded-xl p-1"
                style={{ border: "1px solid #e2e8f0", background: "#f8fafc" }}
              />
            )}
            <input
              ref={portraitRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFilePreview(e, setPortraitPreview)}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>
      </SectionCard>

      {/* Common Title */}
      <SectionCard label="Common Title">
        <FieldLabel>Title Text</FieldLabel>
        <input
          type="text"
          name="exam_title"
          value={form.exam_title}
          onChange={handleChange}
          className={inputCls}
          placeholder="e.g. Periyar University Student Feedback"
        />
      </SectionCard>

      {/* Sections */}
      <SectionCard label="Sections">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs" style={{ color: "#64748b" }}>
            Each section shows as a card on the client page. Links are only
            clickable within the time window.
          </p>
          <button
            type="button"
            onClick={addSection}
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
            style={{ background: "#0a2a6e", color: "#ffffff" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1e3a8a";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(10,42,110,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#0a2a6e";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            + Add Section
          </button>
        </div>

        {form.sections.length === 0 && (
          <div
            className="text-center py-10 rounded-xl"
            style={{ background: "#f8fafc", border: "1px dashed #cbd5e1" }}
          >
            <p className="text-sm" style={{ color: "#94a3b8" }}>
              No sections yet. Click &quot;+ Add Section&quot; to create one.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {form.sections.map((section, si) => (
            <div
              key={si}
              className="rounded-xl overflow-hidden"
              style={{ border: "1px solid #e2e8f0" }}
            >
              {/* Section header bar */}
              <div
                className="flex items-center justify-between px-4 py-2.5"
                style={{
                  background: "#f1f5f9",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <span
                  className="text-xs font-extrabold uppercase tracking-wide"
                  style={{ color: "#0a2a6e" }}
                >
                  Section {si + 1}
                </span>
                <div className="flex items-center gap-2">
                  {/* Visible toggle */}
                  <button
                    type="button"
                    onClick={() => toggleSectionBool(si, "is_open")}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                      section.is_open !== false
                        ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-400"
                        : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${section.is_open !== false ? "bg-green-500" : "bg-gray-400"}`}
                    />
                    {section.is_open !== false ? "Visible" : "Hidden"}
                  </button>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeSection(si)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                    style={{
                      color: "#ef4444",
                      background: "#fef2f2",
                      border: "1px solid #fecaca",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fee2e2";
                      e.currentTarget.style.color = "#dc2626";
                      e.currentTarget.style.border = "1px solid #f87171";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#fef2f2";
                      e.currentTarget.style.color = "#ef4444";
                      e.currentTarget.style.border = "1px solid #fecaca";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3" style={{ background: "#ffffff" }}>
                {/* Title */}
                <div>
                  <FieldLabel>Section Title</FieldLabel>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(si, "title", e.target.value)}
                    className={inputCls}
                    placeholder="e.g. Hall Ticket Download"
                  />
                </div>

                {/* Time Scheduling toggle */}
                <button
                  type="button"
                  onClick={() => toggleSectionBool(si, "use_schedule")}
                  className="inline-flex items-center gap-2.5 text-xs font-semibold px-4 py-2 rounded-lg border transition-all cursor-pointer"
                  style={{
                    background: section.use_schedule ? "#eff6ff" : "#f8fafc",
                    color: section.use_schedule ? "#1d4ed8" : "#64748b",
                    border: section.use_schedule
                      ? "1px solid #bfdbfe"
                      : "1px solid #e2e8f0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.85";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <span
                    className="relative inline-block w-8 h-4 rounded-full transition-colors"
                    style={{
                      background: section.use_schedule ? "#1d4ed8" : "#cbd5e1",
                    }}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${
                        section.use_schedule ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </span>
                  Time Scheduling {section.use_schedule ? "ON" : "OFF"}
                  <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                    {section.use_schedule
                      ? "(Active within time window)"
                      : "(Always open)"}
                  </span>
                </button>

                {/* Time inputs */}
                {section.use_schedule && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <FieldLabel>Opens At</FieldLabel>
                      <input
                        type="time"
                        value={section.start_time}
                        onChange={(e) =>
                          updateSection(si, "start_time", e.target.value)
                        }
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <FieldLabel>Closes At</FieldLabel>
                      <input
                        type="time"
                        value={section.end_time}
                        onChange={(e) =>
                          updateSection(si, "end_time", e.target.value)
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>
                )}

                {/* Links */}
                <div
                  className="rounded-lg p-3"
                  style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: "#475569" }}
                    >
                      Links
                    </span>
                    <button
                      type="button"
                      onClick={() => addLink(si)}
                      className="text-xs font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer"
                      style={{
                        color: "#1d4ed8",
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#dbeafe";
                        e.currentTarget.style.color = "#1e40af";
                        e.currentTarget.style.border = "1px solid #93c5fd";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#eff6ff";
                        e.currentTarget.style.color = "#1d4ed8";
                        e.currentTarget.style.border = "1px solid #bfdbfe";
                        e.currentTarget.style.transform = "none";
                      }}
                    >
                      + Add Link
                    </button>
                  </div>

                  {section.links.length === 0 && (
                    <p
                      className="text-xs text-center py-2"
                      style={{ color: "#94a3b8" }}
                    >
                      No links. Click &quot;+ Add Link&quot;.
                    </p>
                  )}

                  <div className="space-y-2">
                    {section.links.map((link, li) => (
                      <div key={li} className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Button label"
                          value={link.label}
                          onChange={(e) =>
                            updateLink(si, li, "label", e.target.value)
                          }
                          className={inputCls + " flex-1"}
                        />
                        <input
                          type="url"
                          placeholder="https://..."
                          value={link.url}
                          onChange={(e) =>
                            updateLink(si, li, "url", e.target.value)
                          }
                          className={inputCls + " flex-2"}
                        />
                        <button
                          type="button"
                          onClick={() => removeLink(si, li)}
                          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg font-bold text-sm transition-all cursor-pointer"
                          style={{
                            color: "#ef4444",
                            background: "#fef2f2",
                            border: "1px solid #fecaca",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#fee2e2";
                            e.currentTarget.style.color = "#dc2626";
                            e.currentTarget.style.border = "1px solid #f87171";
                            e.currentTarget.style.transform = "scale(1.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#fef2f2";
                            e.currentTarget.style.color = "#ef4444";
                            e.currentTarget.style.border = "1px solid #fecaca";
                            e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Feedback message */}
      {message && (
        <Alert
          type={message.type}
          title={message.type === "success" ? "Settings Saved!" : "Save Failed"}
          message={message.text}
          onClose={() => setMessage(null)}
          autoDismiss={message.type === "success" ? 5000 : 0}
        />
      )}

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2.5 font-bold px-6 py-3 rounded-xl shadow-2xl transition-all text-sm disabled:opacity-60 cursor-pointer"
          onMouseEnter={() => setSaveHover(true)}
          onMouseLeave={() => setSaveHover(false)}
          style={{
            background: saving ? "#64748b" : saveHover ? "#1e3a8a" : "#0a2a6e",
            color: "#ffffff",
            boxShadow:
              saveHover && !saving
                ? "0 12px 32px rgba(10,42,110,0.65)"
                : "0 8px 24px rgba(10,42,110,0.45)",
            transform:
              saveHover && !saving ? "translateY(-2px) scale(1.03)" : "none",
          }}
        >
          {saving ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Save Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
}
