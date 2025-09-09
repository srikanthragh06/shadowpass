import { Request, Response, NextFunction } from "express";
import {
    sendClientSideError,
    sendServerSideError,
} from "../utils/responseTemplates";

/**
 * Global error handler middleware.
 * @param err The error object that was caught.
 * @param req The Request object.
 * @param res The Response object.
 * @param next The NextFunction.
 */
export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);
    return sendServerSideError(req, res, err);
};

/**
 * Middleware to handle requests with invalid JSON format.
 * @param err The error object that was caught (expected to be a SyntaxError).
 * @param req The Request object.
 * @param res The Response object.
 * @param next The NextFunction.
 */
export const incorrectJSONFormatHandler = (
    err: SyntaxError & { status?: number; body?: string },
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // If the error is a SyntaxError, send a 400 Bad Request error response
    if (err instanceof SyntaxError) {
        sendClientSideError(req, res, "Invalid JSON Format");
    } else {
        // Otherwise, the error is not related to JSON format, so call next()
        next();
    }
};
