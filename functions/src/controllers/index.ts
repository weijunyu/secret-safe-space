import * as express from "express";
import { firebaseAdmin, firestore } from "../lib/firebase";
import { SECRET_PATH_COLLECTION } from "../lib/constants";

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

export const reserveSecretPath: express.RequestHandler = async (
  req,
  res,
  next
) => {
  let secretPath;
  const requestMethod = req.method.toLowerCase();
  if (requestMethod === "post") {
    secretPath = req.body.path;
  }
  if (requestMethod === "get" && typeof req.query.path === "string") {
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
  const secretDoc: SecretDocument = {
    reserveTime: firebaseAdmin.firestore.Timestamp.now(),
  };
  await firestore
    .collection(SECRET_PATH_COLLECTION)
    .doc(secretPath)
    .set(secretDoc);
  return res.send({
    secretPath,
  });
};

export const setSecretAtPath: express.RequestHandler = async (
  req,
  res,
  next
) => {
  let secretPath;
  let secretText;
  const requestMethod = req.method.toLowerCase();
  if (requestMethod === "get") {
    secretPath = req.query.path;
    secretText = req.query.secret;
  }
  if (requestMethod === "post") {
    secretPath = req.body.path;
    secretText = req.body.secret;
  }
  if (!secretPath || !secretText) {
    return next(
      new Error("Missing argument(s): specify secret path and text!")
    );
  }
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
};
