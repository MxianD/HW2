# HW2 Q3.1 — Privacy exercise (URL tracking + exfiltration)

This folder contains a **course-only** Chrome extension and a small Node.js server that appends visited URLs to `server/visits.csv`.

## Prerequisites

- Google Chrome (or Chromium) for loading the unpacked extension
- Node.js 18+ for the server

## 1. Start the server

```bash
cd server
npm install
npm start
```

By default the server listens on `http://127.0.0.1:3940` and accepts `POST /log` with JSON `{ time, url, tabId, transitionType }`.

Optional: `set PORT=3950` (Windows) or `PORT=3950 npm start` (Unix) to change the port. If you change the port, edit `EXFIL_URL` in `extension/background.js` to match.

## 2. Load the extension

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select the `extension` folder inside `Q3.1`

Grant any prompts. The manifest uses `webNavigation` and `<all_urls>` so Chrome will warn that the extension can read activity on all sites — that is expected for this assignment.

## 3. Verify

1. With the server running, browse to a few sites in a new tab.
2. Open `server/visits.csv` — new lines should appear with timestamps and URLs.

## 4. Video (required by the assignment)

Record a short screen capture showing:

- Extension loaded
- Server running
- You visiting at least one website
- `visits.csv` updating (refresh the file in your editor or open it after browsing)

Save the video where Gradescope / course instructions specify and mention the filename in your write-up if required.

## Security note

Do not install this extension in your everyday browser profile. Use a separate Chromium profile or VM for class work.
