export class HTTPError extends Error {
  constructor(msg: string, public status: number) {
    super(msg);
  }
}
