import { Head } from "$fresh/runtime.ts";
import { Member } from "../../schema.ts";
import { getMembers } from "../../storage/members.ts";

const Member = ({ member }: { member: Member }) => (
  <div class="member">
    {member.isAdmin && <b>Admin</b>}
    <div className="name">{member.name}</div>
    <div className="email">{member.email}</div>
    <div className="id">{member.id}</div>
  </div>
);

export default async function Members() {
  const members = await getMembers();

  return (
    <>
      <Head>
        <link rel="stylesheet" href="/admin.css" />
      </Head>
      <main>
        <h1>Members</h1>
        {members.map((member) => <Member member={member} />)}
      </main>
    </>
  );
}
