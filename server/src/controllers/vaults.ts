import { NextFunction, Request, Response } from "express";
import {
    sendClientSideError,
    sendSuccessResponse,
} from "../utils/responseTemplates";
import { queryClient, transaction } from "../db/postgres";

/**
 * Handles a GET request to retrieve a vault for a given username.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The Express next middleware function.
 */
export const getVaultHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { username }: { username: string } = request as any;

        await transaction(async (client) => {
            // Retrieve the vault for the given username
            const { rows: rowsWithVault } = await queryClient(
                client,
                `SELECT vault FROM "Vaults" WHERE "username" = $1;`,
                [username]
            );

            if (rowsWithVault.length === 0)
                // If the vault is not found, return a 401 Unauthorized response
                return sendClientSideError(
                    request,
                    response,
                    `Vault not found for username: ${username}!`,
                    401
                );

            // Extract the vault from the query result
            const vault = rowsWithVault[0].vault;

            // Return a success response with the vault
            return sendSuccessResponse(
                request,
                response,
                "Vault retreived successfully!",
                200,
                { vault }
            );
        });
    } catch (err) {
        // If there's an error, call next(err) to pass it to the next middleware
        next(err);
    }
};

/**
 * Handles a request to update the vault for a given username.
 * @param request The express request object
 * @param response The express response object
 * @param next The express next middleware function
 */
export const updateVaultHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { username }: { username: string } = request as any;
        const { vault } = request.body;

        /**
         * Transaction to update the vault for the given username
         */
        await transaction(async (client) => {
            const { rows: rowsWithUsername } = await queryClient(
                client,
                `SELECT 1 FROM "Vaults" WHERE "username" = $1;`,
                [username]
            );
            if (rowsWithUsername.length === 0)
                // If the vault is not found, return a 400 Bad Request response
                return sendClientSideError(
                    request,
                    response,
                    `Vault with username: ${username} does not exist!`,
                    400
                );

            // Update the vault for the given username
            await queryClient(
                client,
                `UPDATE "Vaults" SET "vault" = $1 WHERE "username" = $2;`,
                [vault, username]
            );

            // Return a success response
            return sendSuccessResponse(
                request,
                response,
                `Vault updated successfully for user with username:${username}!`,
                200
            );
        });
    } catch (err) {
        // If there's an error, call next(err) to pass it to the next middleware
        next(err);
    }
};

/**
 * Handles a request to delete the vault for a given username.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The Express next middleware function.
 */
export const deleteVaultHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { username }: { username: string } = request as any;

        // Start a transaction to handle multiple SQL queries
        await transaction(async (client) => {
            // Retrieve the vault for the given username
            const { rows: rowsWithUsername } = await queryClient(
                client,
                `SELECT 1 FROM "Vaults" WHERE "username" = $1;`,
                [username]
            );

            // If the vault is not found, return a 401 Unauthorized response
            if (rowsWithUsername.length === 0)
                return sendClientSideError(
                    request,
                    response,
                    `Vault not found for username: ${username}!`,
                    401
                );

            // Delete the vault for the given username
            await queryClient(
                client,
                `DELETE FROM "Vaults" WHERE "username" = $1;`,
                [username]
            );
            // Return a success response with a message
            return sendSuccessResponse(
                request,
                response,
                "Vault deleted successfully!",
                200
            );
        });
    } catch (err) {
        // If there's an error, call next(err) to pass it to the next middleware
        next(err);
    }
};
