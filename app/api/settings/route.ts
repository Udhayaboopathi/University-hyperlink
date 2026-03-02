import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "site-settings.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function readSettings() {
  if (!existsSync(DATA_FILE)) {
    return {};
  }
  const raw = readFileSync(DATA_FILE, "utf-8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function writeSettings(data: Record<string, unknown>) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET() {
  try {
    const settings = readSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to read settings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const settings = readSettings() as Record<string, unknown>;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      // ensure upload directory exists
      if (!existsSync(UPLOAD_DIR)) {
        mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      // text fields
      const textFields = [
        "university_tamil_name",
        "university_english_name",
        "ranking_text",
        "address",
        "exam_title",
        "session_open_time",
        "exam_start_time",
        "exam_end_time",
      ];

      for (const field of textFields) {
        const value = formData.get(field);
        if (value !== null) {
          settings[field] = value as string;
        }
      }

      // sections – sent as a JSON string
      const sectionsRaw = formData.get("sections");
      if (sectionsRaw !== null) {
        try {
          settings["sections"] = JSON.parse(sectionsRaw as string);
        } catch {
          settings["sections"] = [];
        }
      }

      // file fields
      const fileFields = ["logo", "right_image"];
      for (const field of fileFields) {
        const file = formData.get(field) as File | null;
        if (file && file.size > 0) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const safeName = `${field}-${Date.now()}${path.extname(file.name)}`;
          const filePath = path.join(UPLOAD_DIR, safeName);
          writeFileSync(filePath, buffer);
          settings[field] = `/uploads/${safeName}`;
        }
      }
    } else {
      // JSON body
      const body = await request.json();
      Object.assign(settings, body);
    }

    writeSettings(settings);
    return NextResponse.json({ success: true, data: settings });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 },
    );
  }
}
