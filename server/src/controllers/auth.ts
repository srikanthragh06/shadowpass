import { queryClient, transaction } from "../db/postgres";
import { NextFunction, Request, Response } from "express";
import {
    sendClientSideError,
    sendSuccessResponse,
} from "../utils/responseTemplates";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

/**
 * Handles the registration of a new user.
 * @param request The express request object.
 * @param response The express response object.
 * @param next The express next middleware function.
 */
export const registerHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { username, masterToken } = request.body;

        // Check if the user already exists
        await transaction(async (client) => {
            const { rows: rowsFromUsernameAndMasterToken } = await queryClient(
                client,
                `SELECT 1 FROM "Vaults" WHERE "username" = $1 AND "masterToken" = $2;`,
                [username, masterToken]
            );
            if (rowsFromUsernameAndMasterToken.length > 0) {
                // If the user already exists, return a 401 Unauthorized response
                return sendClientSideError(
                    request,
                    response,
                    "User already exists!",
                    401
                );
            }

            // Insert the new user into the Vault table
            const { rows: rowsWithVaultId } = await queryClient(
                client,
                `INSERT INTO "Vaults" ("username", "masterToken") VALUES ($1, $2) RETURNING "id";`,
                [username, masterToken]
            );
            const vaultId = rowsWithVaultId[0].id;

            // Insert the new user into the Settings table
            const { rows: rowsWithAutoLockTimeInterval } = await queryClient(
                client,
                `INSERT INTO "Settings" ("vaultId") VALUES ($1) RETURNING "autoLockTimeInterval";`,
                [vaultId]
            );
            const autoLockTimeInterval =
                rowsWithAutoLockTimeInterval[0].autoLockTimeInterval;

            // Generate a JWT token for the new user
            const jwtToken = jwt.sign(
                {
                    username,
                },
                JWT_SECRET,
                { expiresIn: autoLockTimeInterval }
            );

            // Return a 201 Created response with the JWT token
            return sendSuccessResponse(
                request,
                response,
                "Registration successful!",
                201,
                {
                    jwtToken,
                }
            );
        });
    } catch (err) {
        // If an error occurs, call the next middleware function with the error
        next(err);
    }
};

/**
 * Handles a login request.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The Express next middleware function.
 */
export const loginHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { username, masterToken } = request.body;

        // Check if the user exists in the Vault table
        await transaction(async (client) => {
            const { rows: rowsFromUsernameAndMasterToken } = await queryClient(
                client,
                `SELECT "id" FROM "Vaults" WHERE "username" = $1 AND "masterToken" = $2;`,
                [username, masterToken]
            );
            if (rowsFromUsernameAndMasterToken.length === 0) {
                // If the user does not exist, return a 401 Unauthorized response
                return sendClientSideError(
                    request,
                    response,
                    "Invalid username or master token!",
                    401
                );
            }

            // Get the vaultId from the query result
            const vaultId = rowsFromUsernameAndMasterToken[0].id;

            // Get the autoLockTimeInterval from the Settings table
            const { rows: rowsWithAutoLockTimeInterval } = await queryClient(
                client,
                `SELECT "autoLockTimeInterval" FROM "Settings" WHERE "vaultId" = $1;`,
                [vaultId]
            );
            const autoLockTimeInterval =
                rowsWithAutoLockTimeInterval[0].autoLockTimeInterval;

            // Generate a JWT token for the user
            const jwtToken = jwt.sign(
                {
                    username,
                },
                JWT_SECRET,
                { expiresIn: autoLockTimeInterval }
            );

            // Return a 200 OK response with the JWT token
            return sendSuccessResponse(
                request,
                response,
                "Login successful!",
                200,
                {
                    jwtToken,
                }
            );
        });
    } catch (err) {
        // If an error occurs, call the next middleware function with the error
        next(err);
    }
};
