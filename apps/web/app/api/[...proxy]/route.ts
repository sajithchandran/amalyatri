/**
 * Proxy API requests to the backend VPS server.
 * Avoids mixed-content issues (HTTPS frontend ↔ HTTP backend).
 */

const API_BASE = 'http://88.222.214.77:3001';

export const runtime = 'nodejs';

/**
 * Public, user-independent GET endpoints that are safe to cache at the
 * Vercel edge (Mumbai) for a short window. Everything else stays no-store.
 * Personal sub-resources (paths ending in /mine) are explicitly excluded.
 */
const PUBLIC_CACHEABLE: RegExp[] = [
  /^\/api\/v1\/health$/,
  /^\/api\/v1\/knowledge(\/|$)/,
  /^\/api\/v1\/events\/?$/,
  /^\/api\/v1\/communities\/?$/,
  /^\/api\/v1\/communities\/[^/]+$/,
];

const PUBLIC_CACHE_CONTROL = 'public, s-maxage=60, stale-while-revalidate=300';

function isPublicCacheable(method: string, pathname: string): boolean {
  if (!['GET', 'HEAD'].includes(method)) return false;
  if (pathname.includes('/mine')) return false;
  return PUBLIC_CACHEABLE.some((re) => re.test(pathname));
}

async function proxy(request: Request) {
  const url = new URL(request.url);
  const target = `${API_BASE}${url.pathname}${url.search}`;

  // Forward headers needed by the backend
  const headers: Record<string, string> = {};
  for (const [key, value] of request.headers.entries()) {
    if (['content-type', 'authorization', 'user-agent', 'accept', 'x-requested-with', 'x-forwarded-for'].includes(key)) {
      headers[key] = value;
    }
  }

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.text(),
    });

    const resHeaders: Record<string, string> = {
      'content-type': response.headers.get('content-type') || 'application/json',
      'cache-control': isPublicCacheable(request.method, url.pathname)
        ? PUBLIC_CACHE_CONTROL
        : 'no-store',
    };

    return new Response(response.body, {
      status: response.status,
      headers: resHeaders,
    });
  } catch (error) {
    return Response.json(
      { error: 'Backend unreachable', detail: String(error) },
      { status: 502 },
    );
  }
}

export async function GET(request: Request) { return proxy(request); }
export async function POST(request: Request) { return proxy(request); }
export async function PUT(request: Request) { return proxy(request); }
export async function PATCH(request: Request) { return proxy(request); }
export async function DELETE(request: Request) { return proxy(request); }
