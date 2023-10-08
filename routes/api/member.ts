import { Handlers } from "$fresh/server.ts";
import { addMember, getMember } from "../../storage/members.ts";

export const handler: Handlers = {
  async GET(req) {
    console.log("GET api/member");
    const params = new URL(req.url).searchParams;
    const member = await getMember(params.get("id") || "");
    return new Response(JSON.stringify(member));
  },

  async POST(req) {
    console.log("POST api/member");
    const params = new URL(req.url).searchParams;
    const name = params.get("name");
    const email = params.get("email");
    if (name && email) {
      const uuid = await addMember({ name, email });
      return new Response(uuid);
    } else {
      return new Response("Missing name and email", { status: 400 });
    }
  },
};
