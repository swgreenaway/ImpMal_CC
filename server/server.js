require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const FOUNDRY_API_BASE_URL = process.env.FOUNDRY_API_BASE_URL || 'https://foundryvtt-rest-api-relay.fly.dev/';
const FOUNDRY_API_KEY = process.env.FOUNDRY_API_KEY;
const FOUNDRY_CLIENT_ID = process.env.FOUNDRY_CLIENT_ID;
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CHARACTER_DATA_DIR = path.join(DATA_DIR, 'characters');

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

function parseActorData(rawActorData) {
  if (!rawActorData) {
    return null;
  }

  const actor = rawActorData;
  const system = actor.system || {};

  // Parse characteristics
  const characteristics = {};
  if (system.characteristics) {
    Object.keys(system.characteristics).forEach(key => {
      const char = system.characteristics[key];
      characteristics[key] = {
        starting: char.starting || 0,
        advances: char.advances || 0,
        modifier: char.modifier || 0,
        total: (char.starting || 0) + (char.advances || 0) * 5 + (char.modifier || 0)
      };
    });
  }

  // Parse skills with advances
  const skills = {};
  if (system.skills) {
    Object.keys(system.skills).forEach(key => {
      const skill = system.skills[key];
      if (skill.advances > 0) {
        skills[key] = {
          characteristic: skill.characteristic,
          advances: skill.advances,
          modifier: skill.modifier || 0
        };
      }
    });
  }

  // Parse equipment (weapons, armor, etc)
  const equipment = {
    weapons: [],
    armor: [],
    equipment: [],
    augmetics: []
  };

  if (actor.items) {
    actor.items.forEach(item => {
      const basicItem = {
        name: item.name,
        type: item.type,
        equipped: item.system?.equipped?.value || false
      };

      switch (item.type) {
        case 'weapon':
          equipment.weapons.push({
            ...basicItem,
            damage: item.system?.damage?.base || '0',
            range: item.system?.range || 'melee',
            traits: item.system?.traits?.list?.map(t => t.key) || []
          });
          break;
        case 'protection':
          equipment.armor.push({
            ...basicItem,
            armour: item.system?.armour || 0,
            locations: item.system?.locations?.list || []
          });
          break;
        case 'augmetic':
          equipment.augmetics.push({
            ...basicItem,
            cost: item.system?.cost || 0,
            availability: item.system?.availability || 'common'
          });
          break;
        case 'equipment':
          equipment.equipment.push({
            ...basicItem,
            uses: item.system?.uses?.value || null,
            maxUses: item.system?.uses?.max || null
          });
          break;
      }
    });
  }

  // Parse talents and specializations
  const talents = [];
  const specializations = [];

  if (actor.items) {
    actor.items.forEach(item => {
      if (item.type === 'talent') {
        talents.push({
          name: item.name,
          taken: item.system?.taken || 1,
          xpCost: item.system?.xpCost || 0
        });
      } else if (item.type === 'specialisation') {
        specializations.push({
          name: item.name,
          skill: item.system?.skill,
          advances: item.system?.advances || 1
        });
      }
    });
  }

  return {
    id: actor._id,
    name: actor.name,
    type: actor.type,
    image: actor.img,

    // Character basics
    species: system.details?.species || 'Human',
    origin: system.origin?.name || '',
    faction: system.faction?.name || '',
    role: system.role?.name || '',

    // Core stats
    characteristics,
    skills,

    // Resources
    fate: {
      current: system.fate?.value || 0,
      max: system.fate?.max || 0
    },
    wounds: {
      current: system.combat?.wounds?.value || 0,
      max: system.combat?.wounds?.max || 0
    },
    corruption: {
      current: system.corruption?.value || 0,
      max: system.corruption?.max || 0
    },
    solars: system.solars || 0,

    // Equipment
    equipment,
    talents,
    specializations,

    // Additional info
    influence: system.influence?.factions || {},
    notes: {
      player: system.notes?.player || '',
      gm: system.notes?.gm || ''
    }
  };
}

async function proxySelectedActorRequest(res, requestUrl) {
  if (!FOUNDRY_API_BASE_URL) {
    sendJson(res, 500, { error: 'Foundry API base URL is not configured.' });
    return;
  }

  if (!FOUNDRY_API_KEY) {
    sendJson(res, 500, { error: 'Foundry API key is required.' });
    return;
  }

  if (!FOUNDRY_CLIENT_ID) {
    sendJson(res, 500, { error: 'Foundry client ID is required.' });
    return;
  }

  try {
    const baseUrl = ensureTrailingSlash(FOUNDRY_API_BASE_URL);
    const getUrl = new URL('get', baseUrl);

    getUrl.searchParams.set('clientId', FOUNDRY_CLIENT_ID);
    getUrl.searchParams.set('selected', 'true');
    getUrl.searchParams.set('actor', 'true');

    const headers = {
      Accept: 'application/json',
      'x-api-key': FOUNDRY_API_KEY
    };

    const response = await fetch(getUrl, { headers });
    const text = await response.text();

    if (!response.ok) {
      let details;
      try {
        details = JSON.parse(text);
      } catch (error) {
        details = text;
      }

      sendJson(res, response.status, {
        error: 'Failed to fetch selected actor from Foundry API.',
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
      error: 'Unexpected error retrieving selected actor.',
      details: error.message
    });
  }
}

async function proxySelectedActorParsedRequest(res, requestUrl) {
  if (!FOUNDRY_API_BASE_URL) {
    sendJson(res, 500, { error: 'Foundry API base URL is not configured.' });
    return;
  }

  if (!FOUNDRY_API_KEY) {
    sendJson(res, 500, { error: 'Foundry API key is required.' });
    return;
  }

  if (!FOUNDRY_CLIENT_ID) {
    sendJson(res, 500, { error: 'Foundry client ID is required.' });
    return;
  }

  try {
    const baseUrl = ensureTrailingSlash(FOUNDRY_API_BASE_URL);
    const getUrl = new URL('get', baseUrl);

    getUrl.searchParams.set('clientId', FOUNDRY_CLIENT_ID);
    getUrl.searchParams.set('selected', 'true');
    getUrl.searchParams.set('actor', 'true');

    const headers = {
      Accept: 'application/json',
      'x-api-key': FOUNDRY_API_KEY
    };

    const response = await fetch(getUrl, { headers });
    const text = await response.text();

    if (!response.ok) {
      let details;
      try {
        details = JSON.parse(text);
      } catch (error) {
        details = text;
      }

      sendJson(res, response.status, {
        error: 'Failed to fetch selected actor from Foundry API.',
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

    const parsedActor = parseActorData(data);
    if (!parsedActor) {
      sendJson(res, 404, { error: 'No actor data found.' });
      return;
    }

    sendJson(res, 200, parsedActor);
  } catch (error) {
    sendJson(res, 500, {
      error: 'Unexpected error retrieving selected actor.',
      details: error.message
    });
  }
}

async function proxyActorParsedRequest(res, requestUrl) {
  const actorId = requestUrl.pathname.replace('/api/actors/', '').replace('/parsed', '').trim();

  if (!actorId) {
    sendJson(res, 400, { error: 'Actor ID is required.' });
    return;
  }

  if (!FOUNDRY_API_BASE_URL) {
    sendJson(res, 500, { error: 'Foundry API base URL is not configured.' });
    return;
  }

  if (!FOUNDRY_API_KEY) {
    sendJson(res, 500, { error: 'Foundry API key is required.' });
    return;
  }

  if (!FOUNDRY_CLIENT_ID) {
    sendJson(res, 500, { error: 'Foundry client ID is required.' });
    return;
  }

  try {
    const baseUrl = ensureTrailingSlash(FOUNDRY_API_BASE_URL);
    const getUrl = new URL('get', baseUrl);

    getUrl.searchParams.set('clientId', FOUNDRY_CLIENT_ID);
    getUrl.searchParams.set('uuid', `Actor.${actorId}`);

    const headers = {
      Accept: 'application/json',
      'x-api-key': FOUNDRY_API_KEY
    };

    const response = await fetch(getUrl, { headers });
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

    const parsedActor = parseActorData(data);
    if (!parsedActor) {
      sendJson(res, 404, { error: 'No actor data found.' });
      return;
    }

    sendJson(res, 200, parsedActor);
  } catch (error) {
    sendJson(res, 500, {
      error: 'Unexpected error retrieving actor data.',
      details: error.message
    });
  }
}

async function proxyClientsRequest(res, requestUrl) {
  if (!FOUNDRY_API_BASE_URL) {
    sendJson(res, 500, { error: 'Foundry API base URL is not configured.' });
    return;
  }

  if (!FOUNDRY_API_KEY) {
    sendJson(res, 500, { error: 'Foundry API key is required.' });
    return;
  }

  try {
    const baseUrl = ensureTrailingSlash(FOUNDRY_API_BASE_URL);
    const clientsUrl = new URL('clients', baseUrl);

    const headers = {
      Accept: 'application/json',
      'x-api-key': FOUNDRY_API_KEY
    };

    const response = await fetch(clientsUrl, { headers });
    const text = await response.text();

    if (!response.ok) {
      let details;
      try {
        details = JSON.parse(text);
      } catch (error) {
        details = text;
      }

      sendJson(res, response.status, {
        error: 'Failed to fetch clients from Foundry API.',
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

    sendJson(res, 200, data);
  } catch (error) {
    sendJson(res, 500, {
      error: 'Unexpected error retrieving clients list.',
      details: error.message
    });
  }
}

async function proxySearchRequest(res, requestUrl) {
  if (!FOUNDRY_API_BASE_URL) {
    sendJson(res, 500, { error: 'Foundry API base URL is not configured.' });
    return;
  }

  if (!FOUNDRY_API_KEY) {
    sendJson(res, 500, { error: 'Foundry API key is required.' });
    return;
  }

  if (!FOUNDRY_CLIENT_ID) {
    sendJson(res, 500, { error: 'Foundry client ID is required.' });
    return;
  }

  try {
    const baseUrl = ensureTrailingSlash(FOUNDRY_API_BASE_URL);
    const searchUrl = new URL('api/search', baseUrl);

    const searchParams = requestUrl.searchParams;
    for (const [key, value] of searchParams) {
      searchUrl.searchParams.set(key, value);
    }

    const headers = {
      Accept: 'application/json',
      'x-api-key': FOUNDRY_API_KEY,
      'x-client-id': FOUNDRY_CLIENT_ID
    };

    const response = await fetch(searchUrl, { headers });
    const text = await response.text();

    if (!response.ok) {
      let details;
      try {
        details = JSON.parse(text);
      } catch (error) {
        details = text;
      }

      sendJson(res, response.status, {
        error: 'Failed to search Foundry API.',
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

    sendJson(res, 200, data);
  } catch (error) {
    sendJson(res, 500, {
      error: 'Unexpected error searching Foundry API.',
      details: error.message
    });
  }
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

  if (!FOUNDRY_API_KEY) {
    sendJson(res, 500, { error: 'Foundry API key is required.' });
    return;
  }

  if (!FOUNDRY_CLIENT_ID) {
    sendJson(res, 500, { error: 'Foundry client ID is required.' });
    return;
  }

  try {
    const baseUrl = ensureTrailingSlash(FOUNDRY_API_BASE_URL);
    const getUrl = new URL('get', baseUrl);

    getUrl.searchParams.set('clientId', FOUNDRY_CLIENT_ID);
    getUrl.searchParams.set('uuid', `Actor.${actorId}`);

    const headers = {
      Accept: 'application/json',
      'x-api-key': FOUNDRY_API_KEY
    };

    const response = await fetch(getUrl, { headers });
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
    case '.webp':
      return 'image/webp';
    case '.ico':
      return 'image/x-icon';
    default:
      return 'application/octet-stream';
  }
}

function resolveStaticPath(pathname) {
  if (pathname === '/' || pathname === '') {
    return path.join(PUBLIC_DIR, 'character-creator.html');
  }

  const stripped = pathname.replace(/^\/+/, '');

  if (stripped.startsWith('data/characters/')) {
    const relativeDataPath = stripped.replace(/^data\//, '');
    const dataPath = path.resolve(DATA_DIR, relativeDataPath);

    if (dataPath.startsWith(CHARACTER_DATA_DIR)) {
      return dataPath;
    }
  }

  const publicPath = path.resolve(PUBLIC_DIR, stripped);

  if (publicPath.startsWith(PUBLIC_DIR)) {
    return publicPath;
  }

  return null;
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

  // Development endpoint: serve local character data
  if (req.method === 'GET' && requestUrl.pathname.startsWith('/api/dev/characters/')) {
    const characterName = requestUrl.pathname.split('/').pop();
    const filePath = path.join(CHARACTER_DATA_DIR, `${characterName}.json`);

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        sendJson(res, 404, { error: `Character '${characterName}' not found in data/characters` });
        return;
      }

      try {
        const characterData = JSON.parse(data);
        const parsed = parseActorData(characterData);

        // In development mode, use local image if available
        const localImagePath = path.join(CHARACTER_DATA_DIR, `${characterName}.webp`);
        if (fs.existsSync(localImagePath)) {
          parsed.image = `/data/characters/${characterName}.webp`;
        }

        sendJson(res, 200, parsed);
      } catch (parseError) {
        sendJson(res, 500, { error: 'Failed to parse character data', details: parseError.message });
      }
    });
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/clients') {
    proxyClientsRequest(res, requestUrl);
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/actors/selected') {
    proxySelectedActorRequest(res, requestUrl);
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/actors/selected/parsed') {
    proxySelectedActorParsedRequest(res, requestUrl);
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname === '/api/search') {
    proxySearchRequest(res, requestUrl);
    return;
  }

  if (req.method === 'GET' && requestUrl.pathname.startsWith('/api/actors/') && requestUrl.pathname.endsWith('/parsed')) {
    proxyActorParsedRequest(res, requestUrl);
    return;
  }

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
