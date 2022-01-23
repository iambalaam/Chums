import { Handler, serve } from "https://deno.land/std@0.114.0/http/server.ts";
import { createClient } from "https://denopkg.com/chiefbiiko/dynamodb/mod.ts";
import { router, Routes } from "https://deno.land/x/url_router@0.0.1/mod.ts";

import { accessKeyId, region, secretAccessKey } from "./credentials.ts";

const denamo = createClient({
  credentials: { accessKeyId, secretAccessKey },
  region,
});

const scanTable: Handler = async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  let response: string;
  try {
    const tableInfo = await denamo.scan({ TableName: path.slice(1) });
    if (tableInfo) {
      response = JSON.stringify(tableInfo);
    } else {
      response = "404";
    }
  } catch (e) {
    response = "404";
  }
  return new Response(response);
};

const routes: Routes = [
  [new URLPattern({ pathname: "*" }), scanTable],
];
console.log(`🦕 Deno server running 🦕`);
await serve(router(routes));
