/// <reference lib="deno.unstable" />

import { Member } from "./schema.ts";

const kv = await Deno.openKv();
const DB = "chums";
const MEMBERS_TABLE = "members";

export async function addMember(member: Omit<Member, "id">) {
  const uuid = crypto.randomUUID();
  await kv.set([DB, MEMBERS_TABLE, uuid], member);
  return uuid;
}

export async function getMember(id: string): Promise<Member> {
  const member = (await kv.get([DB, MEMBERS_TABLE])).value as Member;
  return member;
}
