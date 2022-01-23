import { serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { createClient } from "https://denopkg.com/chiefbiiko/dynamodb/mod.ts";
import { accessKeyId, region, secretAccessKey } from "./credentials.ts";

const denamo = createClient({
  credentials: { accessKeyId, secretAccessKey },
  region,
});

await serve(async (_req) => {
  console.log(await denamo.listTables());
  return new Response("hello noobs");
});
