import { RequestHandler } from "express";
import * as expressValidator from "express-validator";

export const validateRequestParams: RequestHandler = (req, res, next) => {
  const errors = expressValidator.validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 400,
      errors: errors.array().map((error) => ({ message: error.msg })),
    });
  }
  next();
};
