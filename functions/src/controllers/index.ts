import * as express from "express";

import Secret from "../models/Secret";

import { SecretDocument } from "../interfaces";

export const checkSecretAvailability: express.RequestHandler = async (
  req,
  res
) => {
  const secretPath = req.query.path?.toString();
  if (secretPath) {
    const availability = await Secret.getAvailability(secretPath);
    return res.send(availability);
  }
  return res.send(false);
};

export const getSecretAtPath: express.RequestHandler = async (req, res) => {
  const secretPath = req.query.path;
  if (secretPath && typeof secretPath === "string") {
    const secretDocument: SecretDocument | null = await Secret.fetch(
      secretPath
    );

    return res.send(secretDocument);
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
  const expiryDuration: number = req.body.expiryDuration;
  const encrypted: boolean = req.body.encrypted;
  if (!secretPath || !secretText || encrypted == null) {
    return next(
      new Error(
        "Missing argument(s): specify secret path, text and encryption status."
      )
    );
  }

  const secret = new Secret({
    path: secretPath,
    value: secretText,
    expiryDuration,
  });

  try {
    const savedSecret: SecretDocument = await secret.saveIfValid();
    return res.send(savedSecret);
  } catch (err) {
    console.error(err);
    return next({
      status: 500,
      message: "Couldn't create secret.",
    });
  }
};
