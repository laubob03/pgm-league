// Cloudflare Workers 代理 GitHub Gist API（安全增强版）
// 浏览器请求 /api/gists/xxx → Worker（验证签名+Origin+限流）→ api.github.com/gists/xxx
// 环境变量：GITHUB_TOKEN（GitHub PAT）、SIGNING_SECRET（与前端共享的签名密钥）

const ALLOWED_ORIGINS = [
  'https://laubob03.github.io',
  'http://localhost:',
  'http://127.0.0.1:'
];

const MAX_REQUESTS_PER_MINUTE = 60;

function getCorsHeaders(origin) {
  const headers = new Headers();
  if (ALLOWED_ORIGINS.some(o => origin && origin.startsWith(o))) {
    headers.set('Access-Control-Allow-Origin', origin);
  }
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Signature, X-Timestamp');
  headers.set('Access-Control-Max-Age', '86400');
  return headers;
}

async function verifySignature(request, env) {
  const timestamp = request.headers.get('X-Timestamp');
  const signature = request.headers.get('X-Signature');
  if (!timestamp || !signature) return false;

  const now = Date.now();
  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Math.abs(now - ts) > 300000) return false;

  const url = new URL(request.url);
  const path = url.pathname + url.search;
  const message = timestamp + request.method + path;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(env.SIGNING_SECRET),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
  );
  const sigBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0));
  return crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(message));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: getCorsHeaders(origin) });
    }

    if (!url.pathname.startsWith('/api/')) {
      return new Response('Not found', { status: 404 });
    }

    if (!['GET', 'POST', 'PATCH'].includes(request.method)) {
      return new Response('Method not allowed', { status: 405 });
    }

    const originOk = ALLOWED_ORIGINS.some(o => origin.startsWith(o));
    const referer = request.headers.get('Referer') || '';
    const refererOk = !referer || ALLOWED_ORIGINS.some(o => referer.startsWith(o));
    if (!originOk && !refererOk) {
      return new Response('Forbidden', { status: 403, headers: getCorsHeaders(origin) });
    }

    const sigOk = await verifySignature(request, env);
    if (!sigOk) {
      return new Response('Unauthorized', { status: 401, headers: getCorsHeaders(origin) });
    }

    const targetUrl = `https://api.github.com${url.pathname.replace('/api', '')}${url.search}`;

    const headers = {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'PGM-League-Proxy/2.0'
    };
    if (request.method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    const fetchOpts = {
      method: request.method,
      headers,
      redirect: 'follow'
    };
    if (request.method !== 'GET') {
      fetchOpts.body = request.body;
    }

    const response = await fetch(targetUrl, fetchOpts);

    const respHeaders = getCorsHeaders(origin);
    response.headers.forEach((v, k) => {
      if (!['access-control-allow-origin', 'access-control-allow-methods', 'access-control-allow-headers'].includes(k.toLowerCase())) {
        respHeaders.set(k, v);
      }
    });

    return new Response(response.body, { status: response.status, statusText: response.statusText, headers: respHeaders });
  }
};
