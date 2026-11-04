import assert from "node:assert/strict";
import { isResumeDraft } from "../lib/resume-draft.ts";

const valid = {
  version: 1, template: "harvard", accent: "#0f766e", font: "Arial", name: "Alex Morgan", role: "Analyst",
  email: "alex@example.test", phone: "", location: "Kathmandu", website: "", summary: "", skills: "Excel",
  languages: "", education: [{ id: "e1", school: "College", degree: "BBA", place: "Nepal", dates: "2022-2026" }],
  jobs: [{ id: "j1", role: "Analyst", company: "Example", dates: "2024-present", details: "Prepared reports" }],
  projects: "", certifications: "", references: "", photo: "",
};
assert.equal(isResumeDraft(valid), true);
assert.equal(isResumeDraft({ ...valid, template: "student" }), true);
assert.equal(isResumeDraft({ ...valid, template: "ngo" }), true);
assert.equal(isResumeDraft({ ...valid, version: 2 }), false);
assert.equal(isResumeDraft({ ...valid, template: "unknown-template" }), false);
assert.equal(isResumeDraft({ ...valid, accent: "red; background:url(https://example.test)" }), false);
assert.equal(isResumeDraft({ ...valid, photo: "javascript:alert(1)" }), false);
assert.equal(isResumeDraft({ ...valid, jobs: Array.from({ length: 31 }, () => valid.jobs[0]) }), false);
console.log("Verified resume draft version, template, style, photo, and collection bounds.");

