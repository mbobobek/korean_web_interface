import http from "http";
import { readFile, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;
const rootDir = __dirname;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const server = http.createServer(async (req, res) => {
  const reqPath = new URL(req.url, `http://${req.headers.host}`).pathname;
  let filePath = path.join(rootDir, reqPath === "/" ? "index.html" : reqPath);

  try {
    let stats;
    try {
      stats = await stat(filePath);
    } catch (err) {
      // Fallback to index.html for SPA routes
      filePath = path.join(rootDir, "index.html");
      stats = await stat(filePath);
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    const data = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const type = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  } catch (err) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Korean Web static server running on http://localhost:${port}`);
});
