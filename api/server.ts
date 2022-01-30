import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import {
  Next,
  router,
  Routes,
} from "https://deno.land/x/url_router@0.1.1/mod.ts";
import { logger } from "https://deno.land/x/url_router@0.1.1/middlewares/logger.ts";
import { authorize } from "./middlewares/auth.ts";
import { addHeaders } from "./util.ts";
import * as op from "./operations.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};
async function addCorsHeaders(value: unknown, next: Next) {
  const response = await next(value) as Response;
  return addHeaders(response, corsHeaders);
}

const test = ([_req, email]: [Request, string]) => {
  return new Response(email);
};
const authMW = [logger, addCorsHeaders, authorize];
const noAuthMW = [logger, addCorsHeaders];

const routes: Routes = [
  [new URLPattern({ pathname: "/api/test-auth" }), [...authMW, test]],
  [new URLPattern({ pathname: "/api/login" }), [...noAuthMW, op.login]],
  [new URLPattern({ pathname: "*" }), [
    logger,
    () => new Response("404", { status: 404 }),
  ]],
];
console.log(`🦕 Deno server running 🦕`);
await serve(router(routes));
