/**
 * Sends the user's public IP (via ipify) to a configurable endpoint every minute.
 * Manifest V3 service workers cannot use navigator.geolocation; the assignment allows IP OR geolocation.
 * Change REPORT_URL in chrome.storage (see options) or edit the default below.
 */
const DEFAULT_REPORT_URL = "http://127.0.0.1:3847/report";

async function getReportUrl() {
  const { reportUrl } = await chrome.storage.local.get(["reportUrl"]);
  return (typeof reportUrl === "string" && reportUrl.length > 0 ? reportUrl : DEFAULT_REPORT_URL).trim();
}

async function fetchPublicIp() {
  const res = await fetch("https://api.ipify.org?format=json");
  if (!res.ok) throw new Error(`ipify ${res.status}`);
  const data = await res.json();
  return data.ip;
}

async function sendReport() {
  const url = await getReportUrl();
  const payload = {
    kind: "ip",
    ts: Date.now(),
    userAgent: navigator.userAgent,
  };

  try {
    payload.ip = await fetchPublicIp();
  } catch (e) {
    payload.error = String(e?.message || e);
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "cors",
    });
  } catch {
    /* optional local server may be down — code path still exercised */
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("report-ip", { periodInMinutes: 1 });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create("report-ip", { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "report-ip") sendReport();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes.reportUrl) {
    sendReport();
  }
});
