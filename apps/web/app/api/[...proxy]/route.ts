/**
 * Proxy API requests to the backend VPS server.
 * Avoids mixed-content issues (HTTPS frontend ↔ HTTP backend).
 */

const API_BASE = 'http://88.222.214.77:3001';

export const runtime = 'nodejs';

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
      'cache-control': 'no-store',
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
