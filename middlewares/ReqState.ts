import { Member } from "../schema.ts";
import { Cookies } from "./cookieParser.ts";

export interface ReqState {
  cookies: Cookies;
  member: Member;
  session: string;
}
