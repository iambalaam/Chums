import { MiddlewareHandlerContext } from "$fresh/server.ts";

export type Cookies = Record<string, string>;
export interface State {
  cookies: Cookies;
}

export default async function cookieParser(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  const cookieString = req.headers.get("cookie");
  const cookies: Cookies = {};
  if (cookieString) {
    cookieString.split(";").forEach((keyval) => {
      const [key, val] = keyval.trim().split("=");
      cookies[key] = val;
    });
    ctx.state.cookies = cookies;
  }
  return await ctx.next();
}
