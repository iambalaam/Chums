import { AuthToken } from "../schema.ts";
import { kv } from "./kv.ts";
import { getMember } from "./members.ts";

const AUTH_TOKENS_TABLE = "auth-tokens";

export async function getAuthToken(id: string) {
  const authToken = (await kv.get([AUTH_TOKENS_TABLE, id]))
    .value as AuthToken;
  return authToken;
}

export async function createAuthToken(token: Omit<AuthToken, "id">) {
  const uuid = crypto.randomUUID();
  await kv.set([AUTH_TOKENS_TABLE, uuid], { ...token, id: uuid });
  return uuid;
}

export async function authenticateToken(id: string) {
  const token = await getAuthToken(id);
  if (!token) return;
  const now = new Date();
  const expiry = new Date(token.expiry);
  if (now > expiry) return;
  return await getMember(token.memberId);
}
