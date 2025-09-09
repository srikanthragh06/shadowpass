import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { sendClientSideError } from "../utils/responseTemplates";

/**
 * A middleware function that checks for errors in the request body after validation.
 * If any errors are found, it sends a 400 Bad Request response with the first error message.
 * Otherwise, it calls the next middleware function in the stack.
 * @param req The Express request object
 * @param res The Express response object
 * @param next The Express next middleware function
 */
export const validateErrors = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // If there are errors, send a 400 Bad Request response with the first error message
        return sendClientSideError(req, res, errors.array()[0].msg);
    }
    // Otherwise, call the next middleware function in the stack
    next();
};
