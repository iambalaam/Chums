import {
  createAuthToken,
  getPasswordHash,
  setPasswordHash,
} from "./storage.ts";
import {
  comparePassword,
  hashPassword,
  parseJsonRequest,
  setTokenCookie,
} from "./util.ts";

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

// Debug functionality
// export async function setPassword(req: Request) {
//   const json = await parseJsonRequest(req);
//
//   const email: string = json.email;
//   const password: string = json.password;
//   if (email && password) {
//     const hash = hashPassword(password);
//     await setPasswordHash(email, hash);
//     return jsonResponse({ status: "ok" });
//   }
//   return jsonResponse({ status: "error" });
// }

export async function login(req: Request) {
  const json = await parseJsonRequest(req);

  // Validate required parameters
  const { email, password } = json || {};
  if (!email) throw new Error("body.email must be present");
  if (!password) throw new Error("body.password must be present");

  const dbHash = await getPasswordHash(email);
  const equal = comparePassword(password, dbHash);

  if (equal) {
    const token = await createAuthToken(email);
    return jsonResponse(
      { token },
      setTokenCookie(token),
    );
  } else {
    return jsonResponse(
      { status: "error" },
    );
  }
}
