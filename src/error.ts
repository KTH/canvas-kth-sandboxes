import {  CanvasApiResponseError } from "@kth/canvas-api";
import { Request, Response, NextFunction } from "express";
import log from "skog";

export interface ApiError<Codes = string> {
  code: Codes;
  message: string;
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/** Thrown when the request contains semantic errors */
export class UnprocessableEntityError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/** Thrown when the user is not logged in */
export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Thrown when the user is logged in but does not have enough permissions to
 * perform the requested action
 */
export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response<ApiError>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  if (err instanceof CanvasApiResponseError) {
    if (err.response.statusCode === 401) {
      return res.status(401).json({
        code: "unauthorized",
        message: "Invalid access token, user is unauthorized.",
      });
    } else if (err.response.statusCode === 404) {
      return res.status(404).json({
        code: "not_found",
        message: "Not found.",
      });
    } else if (err.response.statusCode === 403) {
      return res.status(403).json({
        code: "unauthorized",
        message: "User are not authorized to perform this task.",
      });
    }
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      code: "forbidden",
      message: err.message,
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      code: "unauthorized",
      message: err.message,
    });
  }

  if (err instanceof BadRequestError) {
    return res.status(400).json({
      code: "bad_request",
      message: err.message,
    });
  }

  if (err instanceof UnprocessableEntityError) {
    return res.status(422).json({
      code: "unprocessable_entity",
      message: err.message,
    });
  }

  log.warn(err as Error, "Internal server Error");
  res.status(500).json({
    code: "internal_error",
    message: "Internal error",
  });
}
