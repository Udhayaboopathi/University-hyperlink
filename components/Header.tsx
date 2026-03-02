import Image from "next/image";

interface HeaderProps {
  university_tamil_name: string;
  university_english_name: string;
  ranking_text: string;
  address: string;
  logo: string;
  right_image: string;
}

export default function Header({
  university_tamil_name,
  university_english_name,
  ranking_text,
  address,
  logo,
  right_image,
}: HeaderProps) {
  return (
    <header
      style={{ background: "#ffffff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
    >
      {/* Top stripe */}
      <div
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(to right, #0a2a6e, #1d4ed8, #3b82f6, #1d4ed8, #0a2a6e)",
        }}
      />

      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-5 md:py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left Logo */}
          <div className="shrink-0">
            {logo ? (
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden">
                <Image
                  src={logo}
                  alt="University Logo"
                  width={144}
                  height={144}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
            ) : (
              <div
                className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center text-xs font-bold text-center"
                style={{
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  border: "2px solid #bfdbfe",
                }}
              >
                LOGO
              </div>
            )}
          </div>

          {/* Center – University Details */}
          <div className="flex-1 text-center px-2 sm:px-4 md:px-6 lg:px-10 min-w-0">
            {/* Tamil name */}
            <h1
              className="font-bold leading-tight"
              style={{
                color: "#cc0000",
                fontSize: "clamp(1.1rem, 2.8vw, 2rem)",
                fontFamily:
                  "'Latha', 'Noto Sans Tamil', 'Arial Unicode MS', sans-serif",
              }}
            >
              {university_tamil_name}
            </h1>

            {/* English name */}
            <h2
              className="font-extrabold uppercase mt-1"
              style={{
                color: "#0a2a6e",
                fontSize: "clamp(0.95rem, 2.4vw, 1.7rem)",
                letterSpacing: "0.14em",
              }}
            >
              {university_english_name}
            </h2>

            {/* Divider */}
            <div className="flex items-center justify-center gap-2 my-2">
              <div
                className="h-px flex-1 max-w-24"
                style={{ background: "#bfdbfe" }}
              />
              <div className="flex gap-1">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#93c5fd" }}
                />
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#1d4ed8" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#93c5fd" }}
                />
              </div>
              <div
                className="h-px flex-1 max-w-24"
                style={{ background: "#bfdbfe" }}
              />
            </div>

            {/* Ranking */}
            <div
              className="leading-snug font-medium whitespace-pre-line"
              style={{
                color: "#334155",
                fontSize: "clamp(0.6rem, 1.2vw, 0.8rem)",
              }}
            >
              {ranking_text}
            </div>

            {/* Address */}
            <p
              className="mt-1 font-medium"
              style={{
                color: "#1d4ed8",
                fontSize: "clamp(0.58rem, 1.1vw, 0.75rem)",
                letterSpacing: "0.04em",
              }}
            >
              {address}
            </p>
          </div>

          {/* Right Logo */}
          <div className="shrink-0">
            {right_image ? (
              <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full overflow-hidden">
                <Image
                  src={right_image}
                  alt="Department Logo"
                  width={144}
                  height={144}
                  className="object-contain w-full h-full"
                  unoptimized
                />
              </div>
            ) : (
              <div
                className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center text-xs font-bold text-center"
                style={{
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  border: "2px solid #bfdbfe",
                }}
              >
                DEPT
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom stripe */}
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(to right, #0a2a6e, #1d4ed8, #3b82f6, #1d4ed8, #0a2a6e)",
        }}
      />
    </header>
  );
}
