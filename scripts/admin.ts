import { createAuthToken } from "../storage/authTokens.ts";
import { addMember } from "../storage/members.ts";

export async function generateAdminAuthToken() {
  const name = prompt("name: ");
  const email = prompt("email: ");
  if (!name || !email) return;
  const id = await addMember({
    name,
    email,
    isAdmin: true,
  });

  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + 1);

  const authToken = await createAuthToken({
    memberId: id,
    expiry: expiry.toISOString(),
  });

  return authToken;
}
