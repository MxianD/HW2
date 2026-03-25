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
