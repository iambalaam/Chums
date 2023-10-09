import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { ReqState } from "./ReqState.ts";

export default async function session(
  _req: Request,
  ctx: MiddlewareHandlerContext<ReqState>,
) {
  if (!ctx.state.cookies) ctx.state.cookies = {};
  ctx.state.session = ctx.state.cookies.session || crypto.randomUUID();

  const response = await ctx.next();
  const setCookies = response.headers.get("Set-Cookie") || "";
  response.headers.set(
    "Set-Cookie",
    `session=${ctx.state.session};  ${setCookies}`,
  );

  return response;
}
