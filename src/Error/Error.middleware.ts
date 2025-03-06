import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ErrorHandler } from "./ErrorHandler";

export const ErrorMiddleware = (
  err: Error | ZodError | ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const messages: string[] = err.errors.map((issue) => issue.message);
    res.status(400).json({
      errors: `something went wrong, ${messages}`
    });
  } else if (err instanceof ErrorHandler) {
    res.status(err.status).json({
      errors: `something went wrong, ${err.message}`
    });
  } else {
    res.status(500).json({
      errors: `something went wrong, ${err.message}`
    });
  }
  next();
};
