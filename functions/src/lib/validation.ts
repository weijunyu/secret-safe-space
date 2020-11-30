import { RequestHandler } from "express";
import * as expressValidator from "express-validator";

export const validateRequestParams: RequestHandler = (req, res, next) => {
  const errors = expressValidator.validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 400,
      message: `Params invalid: ${errors
        .array()
        .map((err) => err.param)
        .join(",")}`,
    });
  }
  next();
};
