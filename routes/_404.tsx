import { Head } from "$fresh/runtime.ts";

// /routes/_404.tsx
// Default 404 page
// All missed routes will go here

export default function Error404() {
  return (
    <>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <div>
        <p>The page you were looking for doesn't exist.</p>
        <a href="/">Go back home</a>
      </div>
    </>
  );
}
