import { createClient } from "https://denopkg.com/chiefbiiko/dynamodb/mod.ts";
import { accessKeyId, region, secretAccessKey } from "./credentials.ts";

export const denamo = createClient({
  credentials: { accessKeyId, secretAccessKey },
  region,
});

///////////////
// passwords //
///////////////
interface EmailHashItem {
  Item: { email: string; hash: string };
}
export async function getPasswordHash(email: string): Promise<string> {
  const doc = await denamo.getItem({
    TableName: "passwords",
    Key: { email },
  }) as EmailHashItem;
  return doc?.Item?.hash;
}
export async function setPasswordHash(email: string, hash: string) {
  await denamo.putItem({
    TableName: "passwords",
    Item: { email, hash },
  });
}
export async function deletePasswordHash(email: string) {
  await denamo.deleteItem({
    TableName: "passwords",
    Key: { email },
  });
}

/////////////////
// auth-tokens //
/////////////////
interface TokenEmailItem {
  Item: { token: string; email: string };
}
export async function createAuthToken(email: string): Promise<string> {
  const uuid = crypto.randomUUID();
  await denamo.putItem({
    TableName: "auth-tokens",
    Item: { token: uuid, email },
  });
  return uuid;
}
export async function authenticateToken(token: string): Promise<string> {
  const doc = await denamo.getItem({
    TableName: "auth-tokens",
    Key: { token },
  }) as TokenEmailItem;
  return doc?.Item?.email;
}
export async function deleteAuthToken(token: string) {
  await denamo.deleteItem({
    TableName: "auth-tokens",
    Key: { token },
  });
}
