import * as express from "express";
import * as cors from "cors";
import { firestore } from "./lib/firebase";
import { SECRET_PATH_COLLECTION } from "./lib/constants";

const pino = require("pino-http")();
const app = express();

app.use(cors());
app.use(pino);

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

export default app;
