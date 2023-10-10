import { RouteContext } from "$fresh/server.ts";
import { ReqState } from "../middlewares/ReqState.ts";

export default function WhoAmI(
  ctx: RouteContext<null, ReqState>,
  _req: Request,
) {
  const { session, member } = ctx.state;
  return (
    <main>
      {member && (
        <div>
          {member.isAdmin && (
            <p>
              <b>Admin</b>
            </p>
          )}
          <p>Name: {member.name}</p>
          <p>Email: {member.email}</p>
          <p>id: {member.id}</p>
        </div>
      )}
      <p>Session: {session}</p>
    </main>
  );
}
