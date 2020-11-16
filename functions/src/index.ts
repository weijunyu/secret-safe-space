import * as functions from "firebase-functions";

import { firestore } from "./lib/firebase";

export const checkSecretPath = functions
  .region("asia-southeast2")
  .https.onCall((path: string, context) => {
    return true;
  });

export const reserveSecretPath = functions
  .region("asia-southeast2")
  .https.onCall(async (path: string, context) => {
    const addResult = await firestore.collection("testcollection").add({
      message: path,
    });
    return addResult;
  });
