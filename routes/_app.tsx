import { AppProps } from "$fresh/server.ts";
import { ReqState } from "../middlewares/ReqState.ts";

export default function App(props: AppProps<unknown, ReqState>) {
  const { Component } = props;
  const { member } = props.state;
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Chums</title>
        <link rel="stylesheet" href="/styles.css" />
        {member?.isAdmin && <link rel="stylesheet" href="/admin.css" />}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <nav>
          <span className="title">Chums Tennis</span>
          {member?.isAdmin && (
            <a className="admin" href="/admin/members">Admin</a>
          )}
        </nav>
        <Component />
      </body>
    </html>
  );
}
