import { setPasswordHash } from "./storage.ts";
import { hashPassword, parseJsonRequest } from "./util.ts";

export async function setPassword(req: Request) {
  const json = await parseJsonRequest(req);

  // Temporary functionality
  const email: string = json.email;
  const password: string = json.password;
  if (email && password) {
    const hash = hashPassword(password);
    await setPasswordHash(email, hash);
    return new Response("yup");
  }
  return new Response("nope");
}
