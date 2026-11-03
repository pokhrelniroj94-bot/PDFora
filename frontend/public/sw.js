self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload = {};
  try { payload = event.data.json(); } catch { payload = { title: "PDFora News", body: event.data.text() }; }
  const title = payload.title || "PDFora News";
  event.waitUntil(self.registration.showNotification(title, {
    body: payload.body || "A new Nepal market update is available.",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    data: { url: payload.url || "/nepal-market-news" },
    tag: payload.tag || "pdfora-market-news",
    renotify: false,
  }));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || "/nepal-market-news", self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
    for (const client of windows) if (client.url === target && "focus" in client) return client.focus();
    return clients.openWindow(target);
  }));
});