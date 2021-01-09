import * as express from "express";
import * as cors from "cors";
import * as expressValidator from "express-validator";
import * as PinoHttp from "pino-http";
import { logger } from "./lib/logger";
import { CorsOrigins } from "./config";

import {
  checkSecretAvailability,
  getSecretAtPath,
  setSecretAtPath,
  getUsage,
} from "./controllers";

import { validateRequestParams } from "./lib/validation";

const appLogger = PinoHttp({
  logger,
});

const app = express();

app.use(cors({ origin: CorsOrigins }));
app.use(appLogger);

app.get(
  "/secret/availability",
  [expressValidator.query("path").isAlphanumeric()],
  validateRequestParams,
  checkSecretAvailability
);

app.post(
  "/secret",
  [
    expressValidator.body("path").isAlphanumeric(),
    expressValidator.body("secret").isString(),
    expressValidator.body("expiryDuration").isNumeric(),
    expressValidator.body("encryptionDisabled").isBoolean(),
    expressValidator.body("deleteOnLoad").isBoolean(),
  ],
  validateRequestParams,
  setSecretAtPath
);

app.get("/secret", getSecretAtPath);

app.get("/usage", getUsage);

const requestErrorHandler: express.ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next
) => {
  logger.error(err);
  res.status(err.status || err.statusCode || 500).send(err.message);
};

app.use(requestErrorHandler);

export default app;
