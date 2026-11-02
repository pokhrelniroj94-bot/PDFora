import { NextResponse } from "next/server";

export const runtime = "nodejs";

const recentSubmissions = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS = 5;

function plainText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_TO_EMAIL;
  const sender = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !recipient || !sender) {
    return NextResponse.json(
      { error: "The contact form is not configured yet. Please try again later." },
      { status: 503 },
    );
  }

  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const recent = (recentSubmissions.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_SUBMISSIONS) {
    return NextResponse.json({ error: "Too many messages. Please wait a few minutes and try again." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Please submit the form again." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  // Quietly accept bot submissions without sending an email.
  if (plainText(data.website, 200)) return NextResponse.json({ ok: true });

  const name = plainText(data.name, 100);
  const email = plainText(data.email, 254);
  const tool = plainText(data.tool, 120);
  const message = plainText(data.message, 5000);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !validEmail || message.length < 10) {
    return NextResponse.json({ error: "Enter your name, a valid email address and a message of at least 10 characters." }, { status: 400 });
  }

  const text = [
    "New PDFora contact message",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Tool: ${tool || "Not specified"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject: `PDFora contact: ${tool || "General message"}`,
        text,
      }),
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json({ error: "The email service could not send your message. Please try again later." }, { status: 502 });
    }
    recent.push(now);
    recentSubmissions.set(ip, recent);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "The email service is temporarily unavailable. Please try again later." }, { status: 502 });
  }
}
