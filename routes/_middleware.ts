import cookieParser from "../middlewares/cookieParser.ts";
import logger from "../middlewares/logger.ts";
import login from "../middlewares/login.ts";
import session from "../middlewares/session.ts";

export const handler = [
  logger,
  cookieParser,
  session,
  login,
];
