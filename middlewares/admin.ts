import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { HTTPError } from "../errors.ts";
import { ReqState } from "./ReqState.ts";

export default async function admin(
  _req: Request,
  ctx: MiddlewareHandlerContext<ReqState>,
) {
  if (!ctx.state.member) throw new HTTPError("Not logged in", 401);
  if (!ctx.state.member.isAdmin) throw new HTTPError("Not admin", 403);

  return await ctx.next();
}
