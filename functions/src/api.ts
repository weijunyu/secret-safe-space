import * as express from "express";
import * as cors from "cors";
import * as expressValidator from "express-validator";
import * as Pino from "pino-http";

import {
  checkSecretAvailability,
  getSecretAtPath,
  setSecretAtPath,
} from "./controllers";
import { healthCheckRoute } from "./controllers/health";
import { validateRequestParams } from "./lib/validation";

const pino = Pino();
const app = express();

app.use(cors());
app.use(pino);

app.get("/", healthCheckRoute);

app.get(
  "/secret-path/availability",
  [expressValidator.query("path").isAlphanumeric()],
  validateRequestParams,
  checkSecretAvailability
);

app.post(
  "/secret",
  [
    expressValidator.body("path").isAlphanumeric(),
    expressValidator.body("secret"),
  ],
  validateRequestParams,
  setSecretAtPath
);

app.get("/secret", getSecretAtPath);

const requestErrorHandler: express.ErrorRequestHandler = (
  err,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next
) => {
  console.error(err);
  res.status(err.status || err.statusCode || 500).send(err.message);
};

app.use(requestErrorHandler);

export default app;
