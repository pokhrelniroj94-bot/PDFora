self.addEventListener("push", (event) => {
  if (!event.data) return;
  let payload = {};
  try { payload = event.data.json(); } catch { payload = { title: "PDFora News", body: event.data.text() }; }
  event.waitUntil(self.registration.showNotification(payload.title || "PDFora News", {
    body: payload.body || "A new Nepal market update is available.",
    data: { url: payload.url || "/nepal-market-news" },
    tag: payload.tag || "pdfora-market-news",
    renotify: false,
  }));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const requested = event.notification.data?.url || "/nepal-market-news";
  const target = new URL(requested, self.location.origin);
  if (target.origin !== self.location.origin) target.href = new URL("/nepal-market-news", self.location.origin).href;
  event.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
    for (const client of windows) {
      if (new URL(client.url).href === target.href && "focus" in client) return client.focus();
    }
    return clients.openWindow(target.href);
  }));
});
