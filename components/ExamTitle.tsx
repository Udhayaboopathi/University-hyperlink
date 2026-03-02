interface ExamTitleProps {
  title: string;
}

export default function ExamTitle({ title }: ExamTitleProps) {
  return (
    <div
      className="rounded-xl mb-6 px-6 sm:px-10 py-6 sm:py-8 text-center"
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Badge */}
      <span
        className="inline-block px-4 py-1 rounded text-xs font-bold tracking-widest uppercase mb-4"
        style={{
          background: "#fff7ed",
          color: "#c2410c",
          border: "1px solid #fed7aa",
          letterSpacing: "0.18em",
        }}
      >
        Official Portal
      </span>

      {/* Title */}
      <h2
        className="font-black uppercase leading-tight"
        style={{
          color: "#0a2a6e",
          fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)",
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </h2>

      {/* Rule */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <div className="h-0.5 w-12 rounded" style={{ background: "#cbd5e1" }} />
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: "#0a2a6e" }}
        />
        <div className="h-0.5 w-12 rounded" style={{ background: "#cbd5e1" }} />
      </div>
    </div>
  );
}
