import * as express from "express";
import * as cors from "cors";
import { firebaseAdmin, firestore } from "./lib/firebase";
import { SECRET_PATH_COLLECTION } from "./lib/constants";

const pino = require("pino-http")();
const app = express();

app.use(cors());
app.use(pino);

app.get("/secret-path/availability", async (req, res) => {
  const secretPath = req.query.path;
  if (secretPath && typeof secretPath === "string") {
    const pathDetails = await firestore
      .collection(SECRET_PATH_COLLECTION)
      .doc(secretPath)
      .get();
    return res.send(!pathDetails.exists);
  } else {
    return res.send(false);
  }
});

app.get("/secret-path", async (req, res) => {
  const secretPath = req.query.path;
  if (secretPath && typeof secretPath === "string") {
    const secretDoc = await firestore
      .collection(SECRET_PATH_COLLECTION)
      .doc(secretPath)
      .get();
    return res.send(secretDoc.data());
  } else {
    return res.send(null);
  }
});

app.post("/secret-path", reserveSecretPath);
app.get("/secret-path/reserve", reserveSecretPath);
async function reserveSecretPath(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  let secretPath;
  if (req.method.toLowerCase() === "post") {
    secretPath = req.body.path;
  }
  if (
    req.method.toLowerCase() === "get" &&
    typeof req.query.path === "string"
  ) {
    secretPath = req.query.path;
  }
  if (!secretPath) {
    return next(new Error("Missing argument: specify your secret path!"));
  }
  // todo: wrap this check + write in a transaction
  const existingPath = await firestore
    .collection(SECRET_PATH_COLLECTION)
    .doc(secretPath)
    .get();
  if (existingPath.exists) {
    // todo: also check if path's creation time has expired
    return next(new Error("Path already exists"));
  }
  await firestore
    .collection(SECRET_PATH_COLLECTION)
    .doc(secretPath)
    .set({
      creationTime: firebaseAdmin.firestore.Timestamp.fromDate(new Date()),
    });
  return res.send({
    secretPath,
  });
}

export default app;
