"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  /** Auto-dismiss after N ms. 0 or omit = no auto-dismiss */
  autoDismiss?: number;
}

const CONFIG: Record<
  AlertType,
  {
    bg: string;
    border: string;
    accent: string;
    titleColor: string;
    textColor: string;
    iconBg: string;
    progressBg: string;
    icon: React.ReactNode;
    defaultTitle: string;
  }
> = {
  success: {
    bg: "#ffffff",
    border: "#bbf7d0",
    accent: "#16a34a",
    titleColor: "#15803d",
    textColor: "#374151",
    iconBg: "#dcfce7",
    progressBg: "#16a34a",
    defaultTitle: "Success",
    icon: (
      <svg
        className="w-5 h-5"
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
    ),
  },
  error: {
    bg: "#ffffff",
    border: "#fecaca",
    accent: "#dc2626",
    titleColor: "#b91c1c",
    textColor: "#374151",
    iconBg: "#fee2e2",
    progressBg: "#dc2626",
    defaultTitle: "Error",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
  warning: {
    bg: "#ffffff",
    border: "#fde68a",
    accent: "#d97706",
    titleColor: "#b45309",
    textColor: "#374151",
    iconBg: "#fef3c7",
    progressBg: "#d97706",
    defaultTitle: "Warning",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        />
      </svg>
    ),
  },
  info: {
    bg: "#ffffff",
    border: "#bfdbfe",
    accent: "#2563eb",
    titleColor: "#1d4ed8",
    textColor: "#374151",
    iconBg: "#dbeafe",
    progressBg: "#2563eb",
    defaultTitle: "Info",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

export default function Alert({
  type,
  title,
  message,
  onClose,
  autoDismiss,
}: AlertProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const [progress, setProgress] = useState(100);

  // Default auto-dismiss: success=5000ms, others=0 (stays until closed)
  const dismiss_ms =
    autoDismiss !== undefined ? autoDismiss : type === "success" ? 5000 : 0;

  function dismiss() {
    if (exiting || gone) return;
    setExiting(true);
    setTimeout(() => {
      setGone(true);
      onClose?.();
    }, 380);
  }

  // Portal needs document to exist
  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  // Re-show when message changes
  useEffect(() => {
    setGone(false);
    setExiting(false);
    setProgress(100);
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [message, type]);

  // Progress bar + auto-dismiss
  useEffect(() => {
    if (!dismiss_ms || gone || exiting) return;
    const interval = 50;
    const steps = dismiss_ms / interval;
    let current = 100;
    const timer = setInterval(() => {
      current -= 100 / steps;
      setProgress(Math.max(0, current));
      if (current <= 0) {
        clearInterval(timer);
        dismiss();
      }
    }, interval);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, type, dismiss_ms]);

  if (!mounted || gone) return null;

  const c = CONFIG[type];

  const toast = (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 99999,
        width: "340px",
        maxWidth: "calc(100vw - 48px)",
        transform: visible && !exiting ? "translateX(0)" : "translateX(120%)",
        opacity: visible && !exiting ? 1 : 0,
        transition:
          "transform 0.38s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease",
        pointerEvents: "auto",
      }}
      role="alert"
    >
      <div
        style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          borderRadius: "14px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Top accent stripe */}
        <div style={{ height: "3px", background: c.accent }} />

        {/* Body */}
        <div
          style={{
            padding: "14px 16px 12px",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          {/* Icon badge */}
          <div
            style={{
              background: c.iconBg,
              color: c.accent,
              borderRadius: "10px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {c.icon}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: "2px" }}>
            <p
              style={{
                fontWeight: 700,
                fontSize: "14px",
                color: c.titleColor,
                lineHeight: 1.3,
                marginBottom: message ? "3px" : 0,
              }}
            >
              {title ?? c.defaultTitle}
            </p>
            {message && (
              <p
                style={{
                  fontSize: "13px",
                  color: c.textColor,
                  lineHeight: 1.5,
                  wordBreak: "break-word",
                }}
              >
                {message}
              </p>
            )}
          </div>

          {/* Close × */}
          <button
            type="button"
            onClick={dismiss}
            title="Dismiss"
            style={{
              flexShrink: 0,
              width: "26px",
              height: "26px",
              marginTop: "1px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "7px",
              border: "none",
              background: "transparent",
              color: "#9ca3af",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = c.iconBg;
              e.currentTarget.style.color = c.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#9ca3af";
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress bar (only when auto-dismissing) */}
        {dismiss_ms > 0 && (
          <div style={{ height: "3px", background: "#f1f5f9" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: c.progressBg,
                transition: "width 0.05s linear",
                opacity: 0.65,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(toast, document.body);
}
