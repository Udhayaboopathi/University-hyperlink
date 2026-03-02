import { readFileSync } from "fs";
import path from "path";
import Header from "@/components/Header";
import ExamTitle from "@/components/ExamTitle";
import SectionsDisplay, { Section } from "@/components/SectionsDisplay";

interface Settings {
  university_tamil_name: string;
  university_english_name: string;
  ranking_text: string;
  address: string;
  logo: string;
  right_image: string;
  exam_title: string;
  sections?: Section[];
}

function getSettings(): Settings {
  const file = path.join(process.cwd(), "data", "site-settings.json");
  const raw = readFileSync(file, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw) as Settings;
}

export const dynamic = "force-dynamic";

export default function ClientPage() {
  const s = getSettings();

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ background: "#f1f5f9" }}
    >
      <Header
        university_tamil_name={s.university_tamil_name}
        university_english_name={s.university_english_name}
        ranking_text={s.ranking_text}
        address={s.address}
        logo={s.logo}
        right_image={s.right_image}
      />

      {/* Page content */}
      <div className="flex-1 w-full px-3 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-8">
        {s.exam_title && <ExamTitle title={s.exam_title} />}

        {s.sections && s.sections.length > 0 && (
          <SectionsDisplay sections={s.sections} />
        )}
      </div>

      {/* Footer — always sticks to bottom */}
      <footer
        className="w-full py-4 text-center text-xs font-medium"
        style={{
          background: "#ffffff",
          borderTop: "3px solid #1d4ed8",
          color: "#334155",
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} {s.university_english_name}. All
          rights reserved.
        </p>
      </footer>
    </main>
  );
}
