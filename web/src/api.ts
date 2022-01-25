declare const __ENDPOINT__: string;

export async function postJSON(operation = "", data = {}) {
  const response = await fetch(`${__ENDPOINT__}/api/${operation}`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });

  // Parses JSON response into native JavaScript objects.
  return response.json();
}
