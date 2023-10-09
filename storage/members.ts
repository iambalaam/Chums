import { Member } from "../schema.ts";

const DB = Deno.env.get("KV_PREFIX") || "test";

const kv = await Deno.openKv();
const MEMBERS_TABLE = "members";

export async function addMember(member: Omit<Member, "id">) {
  const uuid = crypto.randomUUID();
  await kv.set([DB, MEMBERS_TABLE, uuid], { ...member, id: uuid });
  return uuid;
}

export async function getMember(id: string): Promise<Member> {
  const member = (await kv.get([DB, MEMBERS_TABLE, id])).value as Member;
  return member;
}
