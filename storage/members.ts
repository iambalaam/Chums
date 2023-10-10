import { Member } from "../schema.ts";

import { kv } from "./kv.ts";
const MEMBERS_TABLE = "members";

export async function addMember(member: Omit<Member, "id">) {
  const uuid = crypto.randomUUID();
  await kv.set([MEMBERS_TABLE, uuid], { ...member, id: uuid });
  return uuid;
}

export async function getMember(id: string): Promise<Member> {
  const member = (await kv.get([MEMBERS_TABLE, id])).value as Member;
  return member;
}
