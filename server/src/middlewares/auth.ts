import { NextFunction, Request, Response } from "express";
import { checkAndGetJWTToken } from "../utils/authorization";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { sendClientSideError } from "../utils/responseTemplates";
import { queryClient, transaction } from "../db/postgres";

/**
 * @function checkAuth
 * @description A middleware function that verifies the presence of a valid JWT
 * token in the Authorization header. If the token is valid, it verifies the
 * user exists in the database.
 * @param {Request} request - The Express request object
 * @param {Response} response - The Express response object
 * @param {NextFunction} next - The Express next middleware function
 */
export const checkAuth = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const jwtToken = checkAndGetJWTToken(request, response, next) as string;
        let decodedToken: jwt.JwtPayload;
        try {
            // Verify the JWT token
            decodedToken = jwt.verify(jwtToken, JWT_SECRET) as jwt.JwtPayload;
        } catch (err) {
            // If the token is invalid or expired, return a 401 Unauthorized response
            return sendClientSideError(
                request,
                response,
                "Invalid or expired jwt token",
                401
            );
        }

        const { username } = decodedToken;
        // Verify the user exists in the database
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
                // If the user does not exist, return a 401 Unauthorized response
                return sendClientSideError(
                    request,
                    response,
                    "Invalid or expired jwt token",
                    401
                );
            }

            // If the user exists, add the username to the request object
            // and call the next middleware
            (request as any).username = username;
            next();
        });
    } catch (err) {
        next(err);
    }
};
