import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);

      const finalHeaders = new Headers(normalized.headers);
      finalHeaders.set("X-Content-Type-Options", "nosniff");
      finalHeaders.set("X-Frame-Options", "DENY");
      finalHeaders.set("X-XSS-Protection", "1; mode=block");
      finalHeaders.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
      finalHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
      finalHeaders.set(
        "Content-Security-Policy",
        [
          "default-src 'self'",
          "img-src 'self' data: https: blob:",
          // TanStack Start injeta scripts inline durante o SSR
          "script-src 'self' 'unsafe-inline'",
          // Tailwind e componentes Radix precisam de estilos inline
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          // Supabase API + Storage
          "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
          "font-src 'self' data: https://fonts.gstatic.com",
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
      );
      finalHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

      return new Response(normalized.body, {
        status: normalized.status,
        statusText: normalized.statusText,
        headers: finalHeaders,
      });
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
