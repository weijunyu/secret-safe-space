import * as Pino from "pino";
import * as config from "../config";

export const logger = Pino({
  level: config.logLevel,
});
