import {
  createAuthToken,
  getPasswordHash,
  setPasswordHash,
} from "./storage.ts";
import { comparePassword, hashPassword, parseJsonRequest } from "./util.ts";

const YEAR_IN_SECS = 60 * 60 * 24 * 365;

function jsonResponse(
  obj: Record<string, unknown>,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(obj), {
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
}

export async function setPassword(req: Request) {
  const json = await parseJsonRequest(req);

  // Temporary functionality
  const email: string = json.email;
  const password: string = json.password;
  if (email && password) {
    const hash = hashPassword(password);
    await setPasswordHash(email, hash);
    return jsonResponse({ status: "ok" });
  }
  return jsonResponse({ status: "error" });
}

export async function login(req: Request) {
  const json = await parseJsonRequest(req);

  // Validate required parameters
  const { email, password } = json || {};
  if (!email) throw new Error("body.email must be present");
  if (!password) throw new Error("body.password must be present");

  const dbHash = await getPasswordHash(email);
  const equal = comparePassword(password, dbHash);

  const token = await createAuthToken(email);

  return jsonResponse(
    { status: equal ? "ok" : "error" },
    { "Set-Cookie": `token=${token}; Max-Age=${YEAR_IN_SECS}` },
  );
}
