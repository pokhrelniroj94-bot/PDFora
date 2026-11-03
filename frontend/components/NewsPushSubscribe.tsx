"use client";

import { useEffect, useState } from "react";

const API = (process.env.NEXT_PUBLIC_API_URL || "https://pdfora-493r.onrender.com").replace(/\\/$/, "");

function toBytes(value: string) {
  const padding = "=".repeat((4 - value.length % 4) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}

export default function NewsPushSubscribe() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const ok = typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    setSupported(ok);
    if (ok) {
      setPermission(Notification.permission);
      navigator.serviceWorker.getRegistration("/").then((registration) => registration?.pushManager.getSubscription()).then((value) => setSubscribed(Boolean(value))).catch(() => setSubscribed(false));
    }
  }, []);

  async function subscribe() {
    setBusy(true); setMessage("");
    try {
      if (!supported) throw new Error("This browser does not support web push notifications.");
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result !== "granted") throw new Error("Notification permission was not granted.");
      const registration = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const keyResponse = await fetch(`${API}/api/push/public-key`, { cache: "no-store" });
      if (!keyResponse.ok) throw new Error("Push notifications are not configured on the server yet.");
      const { publicKey } = await keyResponse.json() as { publicKey: string };
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toBytes(publicKey) });
      const response = await fetch(`${API}/api/push/subscribe`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(subscription.toJSON()) });
      if (!response.ok) throw new Error((await response.json()).detail || "Could not save your subscription.");
      setSubscribed(true);
      setMessage("Notifications enabled. You will receive new Nepal market updates.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not enable notifications.");
    } finally { setBusy(false); }
  }

  async function unsubscribe() {
    setBusy(true); setMessage("");
    try {
      const registration = await navigator.serviceWorker.getRegistration("/");
      const subscription = await registration?.pushManager.getSubscription();
      if (subscription) {
        await fetch(`${API}/api/push/subscribe`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify(subscription.toJSON()) });
        await subscription.unsubscribe();
        setSubscribed(false);
      }
      setMessage("Market notifications have been turned off.");
    } catch { setMessage("Could not turn notifications off. Please try again."); }
    finally { setBusy(false); }
  }

  if (!supported) return <p className="text-xs text-slate-500">Push notifications are not supported in this browser.</p>;
  return <div className="flex flex-col gap-2 rounded-2xl border border-teal-100 bg-teal-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div><p className="font-bold text-slate-900">Get Nepal market alerts on your phone</p><p className="text-sm text-slate-600">Optional alerts for new NEPSE, IPO and allotment updates.</p>{message && <p role="status" className="mt-1 text-xs text-slate-700">{message}</p>}</div>
    <div className="flex shrink-0 gap-2">
      {subscribed ? <button type="button" onClick={unsubscribe} disabled={busy} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-50">{busy ? "Please wait…" : "Turn off alerts"}</button> : <button type="button" onClick={subscribe} disabled={busy} className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800 disabled:opacity-50">{busy ? "Enabling…" : "Enable notifications"}</button>}
    </div>
  </div>;
}
