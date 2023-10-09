import { ErrorPageProps } from "$fresh/server.ts";
import { HTTPError } from "../errors.ts";

export default function Error500Page({ error }: ErrorPageProps) {
  if (error instanceof HTTPError) {
    return <p>{error.status} error: {(error as Error).message}</p>;
  }
  return <p>500 internal error: {(error as Error).message}</p>;
}
