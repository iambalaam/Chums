import {
  compareSync,
  genSaltSync,
  hashSync,
} from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";

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
