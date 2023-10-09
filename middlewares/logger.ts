import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { ReqState } from "./ReqState.ts";

export default async function logger(
  req: Request,
  ctx: MiddlewareHandlerContext<ReqState>,
) {
  const before = Date.now();
  const response = await ctx.next();
  const after = Date.now();

  const who = ctx.state.member
    ? JSON.stringify({ member: ctx.state.member.id.slice(0, 8) })
    : ctx.state.session
    ? JSON.stringify({ session: ctx.state.session.slice(0, 8) })
    : "{?}";

  console.log(
    `[${req.method}] ${new URL(req.url).pathname} (${after - before}ms) ${who}`,
  );
  return response;
}
