import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { ReqState } from "./ReqState.ts";
import { addSetCookie } from "./cookieParser.ts";

export default async function session(
  _req: Request,
  ctx: MiddlewareHandlerContext<ReqState>,
) {
  if (!ctx.state.cookies) ctx.state.cookies = {};
  ctx.state.session = ctx.state.cookies.session || crypto.randomUUID();

  const response = await ctx.next();
  addSetCookie(response, "session", ctx.state.session);

  return response;
}
