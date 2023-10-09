import { AuthToken } from "../schema.ts";
import { getMember } from "./members.ts";

const DB = Deno.env.get("KV_PREFIX") || "test";

const kv = await Deno.openKv();
const AUTH_TOKENS_TABLE = "auth-tokens";

export async function getAuthToken(id: string) {
  const authToken = (await kv.get([DB, AUTH_TOKENS_TABLE, id]))
    .value as AuthToken;
  return authToken;
}

export async function createAuthToken(token: AuthToken) {
  const uuid = crypto.randomUUID();
  await kv.set([DB, AUTH_TOKENS_TABLE, uuid], token);
  return uuid;
}

export async function authenticateToken(id: string) {
  const token = await getAuthToken(id);
  if (!token) return;
  const now = new Date();
  const expiry = new Date(token.expiry);
  if (now < expiry) return;
  return await getMember(token.memberId);
}
