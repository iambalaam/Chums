import {
  compareSync,
  genSaltSync,
  hashSync,
} from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";

const YEAR_IN_SECS = 60 * 60 * 24 * 365;
export const setTokenCookie = (token: string): Record<string, string> => ({
  "Set-Cookie": `token=${token}; Max-Age=${YEAR_IN_SECS}`,
});

export const addHeaders = (
  res: Response,
  headers: Record<string, string> = {},
): Response => {
  res.headers.forEach((value, name) => {
    headers[name] = value;
  });
  return new Response(
    res.body,
    {
      headers,
      status: res.status,
      statusText: res.statusText,
    },
  );
};

export function hashPassword(password: string): string {
  const salt = genSaltSync(8);
  return hashSync(password, salt);
}

export function comparePassword(password: string, hash: string): boolean {
  return compareSync(password, hash);
}

export async function parseJsonRequest(req: Request) {
  if (req.method !== "POST") return undefined;
  if (req.headers.get("content-type") !== "application/json") return undefined;
  if (!req.body) return undefined;
  try {
    return await req.json();
  } catch (_e) {
    return undefined;
  }
}
