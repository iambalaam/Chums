import { createClient } from "https://denopkg.com/chiefbiiko/dynamodb/mod.ts";
import { accessKeyId, region, secretAccessKey } from "./credentials.ts";

const denamo = createClient({
  credentials: { accessKeyId, secretAccessKey },
  region,
});

interface EmailHashItem {
  Item: { email: string; hash: string };
}

// export async function getItem<T>(table: string, key:string, value: string): Promise<T> {
//   return await denamo.getItem({
//     TableName: table,
//     Key: { [key]: value}
//   }) as T;
// }

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
