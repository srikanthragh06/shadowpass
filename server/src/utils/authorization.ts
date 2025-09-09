import { NextFunction, Request, Response } from "express";
import { sendClientSideError } from "./responseTemplates";

/**
 * A middleware function that checks for the presence of the Authorization header
 * and attempts to extract the JWT token from it.
 * @param req The Express request object
 * @param res The Express response object
 * @param next The Express next middleware function
 * @returns The extracted JWT token if successful, or sends a 401 Unauthorized
 * response if there's an error
 */
export const checkAndGetJWTToken = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader === undefined || authHeader === null) {
            return sendClientSideError(
                req,
                res,
                "Missing Authorization Header",
                401
            );
        }

        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return sendClientSideError(
                req,
                res,
                "Invalid Authorization Header",
                401
            );
        }

        const authToken = parts[1]; // This is the actual token
        return authToken;
    } catch (err) {
        next(err);
    }
};
