import * as express from "express";
import * as cors from "cors";

import {
  checkSecretAvailability,
  getSecretAtPath,
  reserveSecretPath,
  setSecretAtPath,
} from "./controllers";

import * as Pino from "pino-http";
const pino = Pino();
const app = express();

app.use(cors());
app.use(pino);

app.get("/", (req, res) => res.send("OK"));

app.get("/secret-path/availability", checkSecretAvailability);

app.get("/secret-path", getSecretAtPath);

app.post("/secret-path", reserveSecretPath);
app.get("/secret-path/reserve", reserveSecretPath);

app.get("/secret/set", setSecretAtPath);
app.post("/secret", setSecretAtPath);

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
