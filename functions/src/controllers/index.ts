import * as express from "express";

import Secret from "../models/Secret";
import * as Usage from "../models/Usage";

import { SecretDocument, SecretType } from "../interfaces";

import { logger } from "../lib/logger";

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
  const secretType: SecretType = req.body.secretType;
  const expiryDuration: number = req.body.expiryDuration;
  const encryptionDisabled: boolean = req.body.encryptionDisabled;
  const deleteOnLoad: boolean = req.body.deleteOnLoad;
  if (
    !secretPath ||
    !secretText ||
    encryptionDisabled === null ||
    encryptionDisabled === undefined
  ) {
    return next(
      new Error(
        "Missing argument(s): specify secret path, text and encryption status."
      )
    );
  }

  const secret = new Secret({
    path: secretPath,
    type: secretType,
    value: secretText,
    expiryDuration,
    encryptionDisabled,
    deleteOnLoad,
  });

  try {
    const savedSecret: SecretDocument = await secret.saveIfValid();
    Usage.increment().catch(logger.error); // fire and forget
    return res.send(savedSecret);
  } catch (err) {
    logger.error(err);
    return next({
      status: 500,
      message: "Couldn't create secret.",
    });
  }
};

export const getUsage: express.RequestHandler = async (req, res, next) => {
  try {
    return res.send({ total: await Usage.getTotal() });
  } catch (err) {
    return next({
      status: 500,
      message: "Couldn't retrieve usage stats",
    });
  }
};
