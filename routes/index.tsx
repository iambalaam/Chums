/// <reference lib="deno.unstable" />
import { RouteContext } from "$fresh/server.ts";
import Loading from "../components/Loading.tsx";
import { ReqState } from "../middlewares/ReqState.ts";

export default function Home(
  ctx: RouteContext<null, ReqState>,
  _req: Request,
) {
  return (
    <main>
      <h1>Home Page</h1>
      <p>Hello {ctx.state.member?.name}</p>
      <Loading />
    </main>
  );
}
