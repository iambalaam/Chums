import { Next } from "https://deno.land/x/url_router@0.1.1/mod.ts";
import { authenticateToken } from "../storage.ts";
import { addHeaders, setTokenCookie } from "../util.ts";

export async function authorize(
  req: Request,
  next: Next,
): Promise<Response> {
  // get token from searchParams
  const url = new URL(req.url);
  const searchToken = url.searchParams.get("token");
  if (searchToken) {
    const email = await authenticateToken(searchToken);
    if (email) {
      const res = await next([req, email]);
      return addHeaders(res, setTokenCookie(searchToken));
    }
  }

  // get token from cookies
  const cookies = req.headers.get("Cookie")?.split("; ");
  const cookieToken = cookies?.find((c) => c.startsWith("token="));
  if (cookieToken) {
    const token = cookieToken.split("=")[1];
    const email = await authenticateToken(token);
    if (email) {
      const res = await next([req, email]);
      return addHeaders(res, setTokenCookie(token));
    }
  }

  throw new Error("Unauthorized");
}
