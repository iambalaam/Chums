import { load } from "https://deno.land/std@0.203.0/dotenv/mod.ts";
await load({ export: true });

const { createAuthToken } = await import("../../storage/authTokens.ts");
const { addMember } = await import("../../storage/members.ts");

if (Deno.env.get("ENV") === "production") {
  Deno.env.set("KV_PREFIX", "chums");
} else {
  Deno.env.set("KV_PREFIX", "test");
}

export async function generateAdminAuthToken() {
  const name = prompt("name: ");
  const email = prompt("email: ");
  if (!name || !email) return;

  try {
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
  } catch (e) {
    console.error(e);
  }
}

console.log(await generateAdminAuthToken());
