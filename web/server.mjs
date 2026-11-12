import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const webRootDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
const tsReactDir = resolve(webRootDir, '..', 'typescript-react');
const academyDistDir = resolve(tsReactDir, 'dist');
const port = Number(process.env.PORT) || 3030;

if (
  !existsSync(resolve(academyDistDir, 'index.html')) &&
  existsSync(resolve(tsReactDir, 'node_modules'))
) {
  console.log('Compilando Academia & Dojo de typescript-react/dist por primera vez...');
  execSync('npm run build', { cwd: tsReactDir, stdio: 'inherit' });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function resolveSafeFile(baseDir, relativeSubpath) {
  const cleaned = relativeSubpath.replace(/^\/+/, '') || 'index.html';
  const fullPath = resolve(baseDir, cleaned);
  if (fullPath !== baseDir && !fullPath.startsWith(baseDir + sep)) {
    return null;
  }
  return fullPath;
}

createServer(async (req, res) => {
  const rawUrl = (req.url ?? '/index.html').split('?')[0];

  if (rawUrl === '/academy') {
    res.writeHead(302, { Location: '/academy/' });
    res.end();
    return;
  }

  let targetPath = null;
  if (rawUrl.startsWith('/academy/')) {
    const subPath = rawUrl.slice('/academy/'.length) || 'index.html';
    targetPath = resolveSafeFile(academyDistDir, subPath);
  } else {
    const subPath = rawUrl === '/' ? 'index.html' : rawUrl;
    targetPath = resolveSafeFile(webRootDir, subPath);
  }

  if (!targetPath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    const content = await readFile(targetPath);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[extname(targetPath)] || 'application/octet-stream',
    });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, () => {
  console.log(`Game of Life Polyglot Lab + TS/React Dojo disponible en http://localhost:${port}`);
  console.log(`Dojo standalone directo en http://localhost:${port}/academy/?view=dojo`);
});
