import { AppProps } from "$fresh/server.ts";

// /routes/_app.tsx
// Default app wrapper
// Useful to write to <head />

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Chums</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
