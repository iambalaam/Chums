const KV_ENDPOINT =
  "https://api.deno.com/databases/51993563-d1f3-44a9-9a5b-dd9a64fc9834/connect";
const DB = Deno.env.get("ENV") === "production"
  ? await Deno.openKv(KV_ENDPOINT)
  : await Deno.openKv();

const prefix = Deno.env.get("KV_PREFIX") || "test";

export const kv = {
  async set(
    key: string[],
    value: unknown,
    options?: { expireIn?: number },
  ) {
    return await DB.set([prefix, ...key], value, options);
  },

  async get(key: string[]) {
    return await DB.get([prefix, ...key]);
  },
  async list(key: string[]) {
    return await DB.list({ prefix: [prefix, ...key] });
  },
};
