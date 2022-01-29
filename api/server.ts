import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import {
  Next,
  router,
  Routes,
} from "https://deno.land/x/url_router@0.1.1/mod.ts";
import { logger } from "https://deno.land/x/url_router@0.1.1/middlewares/logger.ts";
import * as op from "./operations.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};
async function addHeaders(value: unknown, next: Next) {
  const response = await next(value) as Response;
  const headers = { ...corsHeaders };
  response.headers.forEach((value, name) => {
    headers[name] = value;
  });
  const corsResponse = new Response(
    response.body,
    {
      headers,
      status: response.status,
      statusText: response.statusText,
    },
  );
  return corsResponse;
}

const routes: Routes = [
  [new URLPattern({ pathname: "/api/login" }), [logger, addHeaders, op.login]],
  [new URLPattern({ pathname: "/api/setPassword" }), [
    logger,
    addHeaders,
    op.setPassword,
  ]],
  [new URLPattern({ pathname: "*" }), [
    logger,
    () => new Response("404", { status: 404 }),
  ]],
];
console.log(`🦕 Deno server running 🦕`);
await serve(router(routes));
