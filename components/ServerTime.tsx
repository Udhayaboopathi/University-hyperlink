"use client";

import { useEffect, useState } from "react";

export default function ServerTime() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // initialise from client clock; ticks every second
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = time
    ? time.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "--:--:--";

  return (
    <div className="flex justify-center px-4 pb-4">
      <div className="bg-blue-700 text-white rounded-lg px-6 py-3 text-base md:text-lg font-semibold shadow-md">
        🕐 Current Server Time:&nbsp;
        <span className="font-mono">{formatted}</span>
      </div>
    </div>
  );
}
