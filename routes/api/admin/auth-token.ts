import { Handlers } from "$fresh/server.ts";
import { HTTPError } from "../../../errors.ts";
import { createAuthToken } from "../../../storage/authTokens.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const body = await req.json();
    if ("memberId" in body && "expiry" in body) {
      const uuid = await createAuthToken({
        memberId: body.memberId,
        expiry: body.expiry,
      });
      return new Response(uuid);
    } else {
      throw new HTTPError("body.memberId and body.expiry required", 400);
    }
  },
};
