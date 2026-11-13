const CACHE_NAME = "pmp-school-pwa-v1";
const STATIC_ASSETS = ["/", "/index.html", "/manifest.webmanifest", "/pmp-icon.svg"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never cache Sanity CMS queries, Firebase, or Vidya AI API calls
  if (
    request.method !== "GET" ||
    url.hostname.includes("sanity.io") ||
    url.hostname.includes("googleapis.com") ||
    url.pathname.startsWith("/api/")
  ) {
    return;
  }

  // Network-first strategy so live website updates always appear immediately
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === "basic") {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
  );
});
