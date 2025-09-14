import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { sendClientSideError } from "../utils/responseTemplates";
import { queryClient, transaction } from "../db/postgres";

/**
 * Middleware to check authentication using JWT token in cookies.
 *
 * - Verifies the presence and validity of the JWT token in the request cookies.
 * - If valid, checks if the user exists in the database.
 * - If the user exists, attaches the username to the request object and calls next middleware.
 * - Otherwise, sends a 401 Unauthorized error response.
 *
 * @function checkAuth
 * @param {Request} request - The Express request object
 * @param {Response} response - The Express response object
 * @param {NextFunction} next - The Express next middleware function
 * @returns {Promise<void>}
 */
export const checkAuth = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        // Extract JWT token from cookies
        const { jwtToken } = request.cookies;
        if (!jwtToken) {
            // No token found, send 401 Unauthorized
            return sendClientSideError(
                request,
                response,
                `Authorization cookies do not exist`,
                401
            );
        }

        let decodedToken: jwt.JwtPayload;
        try {
            // Verify the JWT token
            decodedToken = jwt.verify(jwtToken, JWT_SECRET) as jwt.JwtPayload;
        } catch (err) {
            // Token is invalid or expired, send 401 Unauthorized
            return sendClientSideError(
                request,
                response,
                "Invalid or expired jwt token",
                401
            );
        }

        const { username } = decodedToken;
        // Check if the user exists in the database
        await transaction(async (client) => {
            const { rows: rowsWithUsername } = await queryClient(
                client,
                `SELECT "username" FROM "Vaults" WHERE "username" = $1;`,
                [username]
            );
            if (
                rowsWithUsername.length === 0 ||
                rowsWithUsername[0].username !== username
            ) {
                // User does not exist, send 401 Unauthorized
                return sendClientSideError(
                    request,
                    response,
                    "Invalid or expired jwt token",
                    401
                );
            }

            // User exists, attach username to request and proceed
            (request as any).username = username;
            next();
        });
    } catch (err) {
        // Pass error to next middleware
        next(err);
    }
};
