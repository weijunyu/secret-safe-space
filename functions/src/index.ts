import * as functions from "firebase-functions";

import { SECRET_PATH_COLLECTION } from "./lib/constants";
import { firebaseAdmin, firestore } from "./lib/firebase";

import apiApp from "./api";

// todo: change functions to https requests to circumvent blocking of POST/PUTs etc...
export const checkSecretPath = functions.region("asia-southeast2").https.onCall(
  async (path: string, context): Promise<boolean> => {
    if (!path) return false;
    const secretPath = await firestore
      .collection(SECRET_PATH_COLLECTION)
      .doc(path)
      .get();
    // todo: also check if creation time has expired
    return !secretPath.exists; // true if no existing path; false if path already there.
  }
);

export const reserveSecretPath = functions
  .region("asia-southeast2")
  .https.onCall(async (path: string, context) => {
    // todo: wrap this check + write in a transaction
    const existingPath = await firestore
      .collection(SECRET_PATH_COLLECTION)
      .doc(path)
      .get();
    if (existingPath.exists) {
      // todo: also check if path's creation time has expired
      return {
        success: false,
        reason: "Path already exists",
      };
    }
    await firestore
      .collection(SECRET_PATH_COLLECTION)
      .doc(path)
      .set({
        creationTime: firebaseAdmin.firestore.Timestamp.fromDate(new Date()),
      });
    return {
      success: true,
      secretPath: path,
    };
  });

export const api = functions.region("asia-southeast2").https.onRequest(apiApp);
