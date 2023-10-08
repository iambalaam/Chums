import { MiddlewareHandlerContext } from "$fresh/server.ts";

export async function handler(req: Request, ctx: MiddlewareHandlerContext) {
  // time req
  const before = Date.now();
  const response = await ctx.next();
  const after = Date.now();

  console.log(
    `[${req.method}] ${new URL(req.url).pathname} (${after - before}ms)`,
  );
  return response;
}
