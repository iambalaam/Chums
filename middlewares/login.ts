import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { authenticateToken } from "../storage/authTokens.ts";
import { ReqState } from "./ReqState.ts";

export default async function login(
  req: Request,
  ctx: MiddlewareHandlerContext<ReqState>,
) {
  const params = new URL(req.url).searchParams;
  const urlToken = params.get("token");
  const cookieToken = ctx.state.cookies.token;
  const token = urlToken || cookieToken;

  if (token) {
    const member = await authenticateToken(token);
    if (member) ctx.state.member = member;
  }

  return await ctx.next();
}
