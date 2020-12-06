import * as express from "express";

import { firebaseAdmin, firestore } from "../lib/firebase";
import {
  SECRET_PATH_COLLECTION,
  DEFAULT_SECRET_EXPIRY_DURATION,
} from "../lib/constants";

import { SecretDocument } from "../interfaces";

export const checkSecretAvailability: express.RequestHandler = async (
  req,
  res
) => {
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
};

export const getSecretAtPath: express.RequestHandler = async (req, res) => {
  const secretPath = req.query.path;
  if (secretPath && typeof secretPath === "string") {
    const secretDoc = await firestore
      .collection(SECRET_PATH_COLLECTION)
      .doc(secretPath)
      .get();
    if (secretDoc.exists) {
      const secretDocData = secretDoc.data() as SecretDocument;
      return res.send(secretDocData.secret);
    }
    return res.send(null);
  } else {
    return res.send(null);
  }
};

export const setSecretAtPath: express.RequestHandler = async (
  req,
  res,
  next
) => {
  const secretPath: string = req.body.path;
  const secretText: string = req.body.secret;
  const expiryDuration: number =
    req.body.expiryDuration || DEFAULT_SECRET_EXPIRY_DURATION;
  if (!secretPath || !secretText) {
    return next(
      new Error("Missing argument(s): specify secret path and text!")
    );
  }
  try {
    // todo: wrap this check + write in a transaction
    const existingPath = await firestore
      .collection(SECRET_PATH_COLLECTION)
      .doc(secretPath)
      .get();
    if (existingPath.exists) {
      return next({
        status: 400,
        message: "Can't set a secret at this path. It has already been used.",
      });
    }

    const expiryTimestamp = "todo" + expiryDuration; // todo: calculate expiry duration here
    console.log(expiryTimestamp);
    const secretDoc: SecretDocument = {
      secretWriteTime: firebaseAdmin.firestore.Timestamp.now(),
      secret: secretText,
    };
    await firestore
      .collection(SECRET_PATH_COLLECTION)
      .doc(secretPath)
      .set(secretDoc);
    return res.send({
      success: true,
      secretPath,
    });
  } catch (err) {
    next(err);
  }
};
