import * as express from "express";
import * as cors from "cors";

import {
  checkSecretAvailability,
  getSecretAtPath,
  reserveSecretPath,
  setSecretAtPath,
} from "./controllers";
import { healthCheckRoute } from "./controllers/health";

import * as Pino from "pino-http";
const pino = Pino();
const app = express();

app.use(cors());
app.use(pino);

app.get("/", healthCheckRoute);

app.get("/secret-path/availability", checkSecretAvailability);

app.post("/secret-path", reserveSecretPath);
app.get("/secret-path/reserve", reserveSecretPath);

app.get("/secret/set", setSecretAtPath);
app.post("/secret", setSecretAtPath);

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
