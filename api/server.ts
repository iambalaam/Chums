import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

await serve((_req) => {
  return new Response("hello noobs");
});
