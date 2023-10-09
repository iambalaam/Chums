import { MiddlewareHandlerContext } from "$fresh/server.ts";

export default async function login(
  _req: Request,
  ctx: MiddlewareHandlerContext,
) {
  return await ctx.next();
}
