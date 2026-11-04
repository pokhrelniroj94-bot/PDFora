export type ResumeDraft = {
  version: 1;
  template: string;
  accent: string;
  font: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string;
  languages: string;
  education: Array<{ id: string; school: string; degree: string; place: string; dates: string }>;
  jobs: Array<{ id: string; role: string; company: string; dates: string; details: string }>;
  projects: string;
  certifications: string;
  references: string;
  photo: string;
};

const templates = new Set([
  "harvard", "modern", "executive", "minimal", "creative", "europass", "corporate", "elegant", "compact", "tech",
  "finance", "graduate", "academic", "bold", "clean-two-column", "navy", "emerald", "monochrome", "warm", "international", "student", "ngo", "experienced",
]);
const fonts = new Set(["Arial", "Georgia", "Helvetica", "Times New Roman"]);
const isText = (value: unknown, maxLength = 10_000): value is string =>
  typeof value === "string" && value.length <= maxLength;
const isRows = <T extends Record<string, unknown>>(value: unknown, keys: (keyof T)[]): value is T[] =>
  Array.isArray(value) && value.length <= 30 && value.every((row) =>
    row && typeof row === "object" && keys.every((key) => isText(row[key], 10_000)));

export function isResumeDraft(value: unknown): value is ResumeDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<ResumeDraft>;
  const strings: (keyof ResumeDraft)[] = [
    "name", "role", "email", "phone", "location", "website", "summary", "skills", "languages", "projects", "certifications", "references",
  ];
  return draft.version === 1 && typeof draft.template === "string" && templates.has(draft.template) &&
    typeof draft.accent === "string" && /^#[0-9a-f]{6}$/i.test(draft.accent) &&
    typeof draft.font === "string" && fonts.has(draft.font) &&
    strings.every((key) => isText(draft[key])) &&
    isRows<ResumeDraft["education"][number]>(draft.education, ["id", "school", "degree", "place", "dates"]) &&
    isRows<ResumeDraft["jobs"][number]>(draft.jobs, ["id", "role", "company", "dates", "details"]) &&
    (draft.photo === "" || (isText(draft.photo, 3_000_000) && /^data:image\/(?:jpeg|png|webp);base64,/i.test(draft.photo)));
}

