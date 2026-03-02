"use client";

import { useEffect, useState, useCallback } from "react";

interface CountdownTimerProps {
  targetTime: string; // "HH:MM" 24-hour format
}

function getSecondsUntil(targetTime: string): number {
  const now = new Date();
  const [hh, mm] = targetTime.split(":").map(Number);
  const target = new Date(now);
  target.setHours(hh, mm, 0, 0);
  const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
  return diff;
}

function formatSeconds(sec: number): string {
  if (sec <= 0) return "00m 00s";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0)
    return `${h}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  return `${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

export default function CountdownTimer({ targetTime }: CountdownTimerProps) {
  const [seconds, setSeconds] = useState<number>(() =>
    getSecondsUntil(targetTime),
  );

  const tick = useCallback(() => {
    setSeconds(getSecondsUntil(targetTime));
  }, [targetTime]);

  useEffect(() => {
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  if (seconds <= 0) {
    return (
      <span className="inline-block bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
        Session Started!
      </span>
    );
  }

  return (
    <span className="font-mono font-bold text-blue-800 text-base">
      {formatSeconds(seconds)}
    </span>
  );
}
