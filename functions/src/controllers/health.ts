import * as express from "express";
import { firestore } from "../lib/firebase";

export const healthCheckRoute: express.RequestHandler = async (req, res, next) => {
  try {
    await firestore.collection("test_collection").doc("test_doc").get();
    console.log("Firestore access check completed!");
    return res.send("OK");
  } catch (err) {
    return next(err);
  }
};
