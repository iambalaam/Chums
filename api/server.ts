import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { router, Routes } from "https://deno.land/x/url_router@0.0.1/mod.ts";
import * as op from "./operations.ts";

const routes: Routes = [
  [new URLPattern({ pathname: "/setPassword" }), op.setPassword],
];
console.log(`🦕 Deno server running 🦕`);
await serve(router(routes));
