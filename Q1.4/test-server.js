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
