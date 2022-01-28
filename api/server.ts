import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { router, Routes, Next } from "https://deno.land/x/url_router@0.1.1/mod.ts";
import { logger } from "https://deno.land/x/url_router@0.1.1/middlewares/logger.ts"
import * as op from "./operations.ts";

async function addCORS(value: unknown, next: Next) {
  const response = await next(value) as Response;
  const corsResponse = new Response(
    response.body,
    {
      headers: {
        ...response.headers,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      status: response.status,
      statusText: response.statusText
    }
  );
  return corsResponse;
}

const routes: Routes = [
  [new URLPattern({ pathname: "/api/login" }), [logger, addCORS, op.login]],
  [new URLPattern({ pathname: "/setPassword" }), [logger, addCORS, op.setPassword]],
  [new URLPattern({ pathname: "*" }), [logger, () => new Response('404', { status: 404 })]],

];
console.log(`🦕 Deno server running 🦕`);
await serve(router(routes));
