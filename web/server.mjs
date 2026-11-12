import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const port = Number(process.env.PORT) || 3030;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
};

createServer(async (req, res) => {
  const reqPath = req.url === '/' ? '/index.html' : (req.url ?? '/index.html').split('?')[0];
  const safePath = join(rootDir, reqPath.replace(/^\/+/, ''));

  try {
    const content = await readFile(safePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[extname(safePath)] || 'text/plain' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, () => {
  console.log(`Game of Life Polyglot Lab disponible en http://localhost:${port}`);
});
