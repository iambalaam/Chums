import { getPasswordHash, setPasswordHash } from "./storage.ts";
import { comparePassword, hashPassword, parseJsonRequest } from "./util.ts";

const corsResponse = (obj: object) =>
  new Response(
    JSON.stringify(obj),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    },
  );

export async function setPassword(req: Request) {
  const json = await parseJsonRequest(req);

  // Temporary functionality
  const email: string = json.email;
  const password: string = json.password;
  if (email && password) {
    const hash = hashPassword(password);
    await setPasswordHash(email, hash);
    return corsResponse({ status: "ok" });
  }
  return corsResponse({ status: "error" });
}

export async function login(req: Request) {
  if (req.method === "OPTIONS") {
    return corsResponse({ status: "ok" });
  }

  const json = await parseJsonRequest(req);

  // Did the request succeed?
  // if (!json) return corsResponse("error"); // Make a quick exit.
  if (!json) {
    return corsResponse({ status: "error" });
  }

  // Get our required parameters.
  const { email, password } = json;

  // It takes two.
  if (email && password) {
    // If this is a valid login then the password will match the hash in the database.
    const dbHash = await getPasswordHash(email);
    console.log(dbHash);

    // Is it a match?
    if (comparePassword(password, dbHash)) {
      return corsResponse({ valid: true, password, dbHash });
    }
  }

  // Invalid login attempt.
  return corsResponse({ status: "error" });
}
