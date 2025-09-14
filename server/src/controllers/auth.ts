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
 *
 * - Checks if the username already exists in the Vaults table.
 * - If not, creates a new Vault and Settings entry for the user.
 * - Generates a JWT token and sets it as an HTTP-only cookie.
 * - Returns a success or error response.
 *
 * @function registerHandler
 * @param {Request} request - The express request object.
 * @param {Response} response - The express response object.
 * @param {NextFunction} next - The express next middleware function.
 * @returns {Promise<void>}
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
                `SELECT 1 FROM "Vaults" WHERE "username" = $1;`,
                [username]
            );
            if (rowsFromUsernameAndMasterToken.length > 0) {
                // User already exists, return 401 Unauthorized
                return sendClientSideError(
                    request,
                    response,
                    "User already exists!",
                    401
                );
            }

            // Insert the new user into the Vaults table
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

            // Set JWT token as HTTP-only cookie
            response.cookie("jwtToken", jwtToken, {
                httpOnly: true, // Cannot be accessed by JavaScript
                secure: true, // Only sent over HTTPS
                sameSite: "strict", // Prevent CSRF
            });

            // Return a 201 Created response with the JWT token
            return sendSuccessResponse(
                request,
                response,
                "Registration successful!",
                201
            );
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Handles a login request for an existing user.
 *
 * - Verifies the username and masterToken against the Vaults table.
 * - If valid, fetches the user's autoLockTimeInterval from Settings.
 * - Generates a JWT token and sets it as an HTTP-only cookie.
 * - Returns a success or error response.
 *
 * @function loginHandler
 * @param {Request} request - The express request object.
 * @param {Response} response - The express response object.
 * @param {NextFunction} next - The express next middleware function.
 * @returns {Promise<void>}
 */
export const loginHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { username, masterToken } = request.body;

        // Check if the user exists in the Vaults table
        await transaction(async (client) => {
            const { rows: rowsFromUsernameAndMasterToken } = await queryClient(
                client,
                `SELECT "id" FROM "Vaults" WHERE "username" = $1 AND "masterToken" = $2;`,
                [username, masterToken]
            );
            if (rowsFromUsernameAndMasterToken.length === 0) {
                // User does not exist, return 401 Unauthorized
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

            // Set JWT token as HTTP-only cookie
            response.cookie("jwtToken", jwtToken, {
                httpOnly: true, // Cannot be accessed by JavaScript
                secure: true, // Only sent over HTTPS
                sameSite: "strict", // Prevent CSRF
            });

            // Return a 200 OK response with the JWT token
            return sendSuccessResponse(
                request,
                response,
                "Login successful!",
                200
            );
        });
    } catch (err) {
        next(err);
    }
};
