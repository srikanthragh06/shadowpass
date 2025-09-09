import { NextFunction, Request, Response } from "express";
import { sendClientSideError } from "./responseTemplates";

/**
 * Extracts the authorization token from the Authorization header of the request.
 * @param req The Request object.
 * @param res The Response object.
 * @param next The NextFunction.
 * @returns The extracted authorization token or null if the header is invalid.
 */
export const getAuthTokenFromHeader = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader === undefined || authHeader === null) {
            // Missing Authorization header
            return sendClientSideError(
                req,
                res,
                "Missing Authorization Header",
                401
            );
        }

        // Check if it starts with 'Bearer ' and extract the token
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            // Invalid Authorization header
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
