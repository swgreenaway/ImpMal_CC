const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const FOUNDRY_API_BASE_URL = process.env.FOUNDRY_API_BASE_URL;
const FOUNDRY_API_KEY = process.env.FOUNDRY_API_KEY;
const BASE_DIR = __dirname;

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function ensureTrailingSlash(value) {
  if (!value) {
    return value;
  }
  return value.endsWith('/') ? value : `${value}/`;
}

async function proxyActorRequest(res, requestUrl) {
  const actorId = requestUrl.pathname.replace('/api/actors/', '').trim();

  if (!actorId) {
    sendJson(res, 400, { error: 'Actor ID is required.' });
    return;
  }

  if (!FOUNDRY_API_BASE_URL) {
    sendJson(res, 500, { error: 'Foundry API base URL is not configured.' });
    return;
  }

  try {
    const baseUrl = ensureTrailingSlash(FOUNDRY_API_BASE_URL);
    const actorUrl = new URL(`actors/${encodeURIComponent(actorId)}`, baseUrl);
    actorUrl.search = requestUrl.searchParams.toString();

    const headers = {
      Accept: 'application/json'
    };

    if (FOUNDRY_API_KEY) {
      headers.Authorization = `Bearer ${FOUNDRY_API_KEY}`;
    }

    const response = await fetch(actorUrl, { headers });
    const text = await response.text();

    if (!response.ok) {
      let details;
      try {
        details = JSON.parse(text);
      } catch (error) {
        details = text;
      }

      sendJson(res, response.status, {
        error: 'Failed to fetch actor from Foundry API.',
        details
      });
      return;
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (error) {
      sendJson(res, 502, {
        error: 'Foundry API returned non-JSON response.',
        details: text
      });
      return;
    }

    sendJson(res, 200, { actor: data });
  } catch (error) {
    sendJson(res, 500, {
      error: 'Unexpected error retrieving actor data.',
      details: error.message
    });
  }
}

function getContentType(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
      return 'application/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}

function resolveStaticPath(pathname) {
  if (pathname === '/' || pathname === '') {
    return path.join(BASE_DIR, 'ImpMal.html');
  }

  const stripped = pathname.replace(/^\/+/, '');
  const resolved = path.resolve(BASE_DIR, stripped);

  if (!resolved.startsWith(BASE_DIR)) {
    return null;
  }

  return resolved;
}

function serveStaticFile(res, pathname) {
  const filePath = resolveStaticPath(pathname);

  if (!filePath) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.stat(filePath, (statErr, stats) => {
    if (statErr) {
      if (statErr.code === 'ENOENT') {
        sendJson(res, 404, { error: 'Not Found' });
        return;
      }
      sendJson(res, 500, { error: 'Failed to access requested file.' });
      return;
    }

    if (stats.isDirectory()) {
      sendJson(res, 403, { error: 'Directory access is forbidden.' });
      return;
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        sendJson(res, 500, { error: 'Failed to read requested file.' });
        return;
      }

      res.writeHead(200, {
        'Content-Type': getContentType(filePath),
        'Content-Length': data.length
      });
      res.end(data);
    });
  });
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && requestUrl.pathname.startsWith('/api/actors/')) {
    proxyActorRequest(res, requestUrl);
    return;
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method Not Allowed' });
    return;
  }

  serveStaticFile(res, requestUrl.pathname);
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
