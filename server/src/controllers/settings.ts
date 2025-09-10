import { queryClient, transaction } from "../db/postgres";
import { NextFunction, Request, Response } from "express";
import {
    sendClientSideError,
    sendSuccessResponse,
} from "../utils/responseTemplates";

/**
 * Handles a GET request to retrieve the settings for a given username.
 * @param {Request} request - The Express request object
 * @param {Response} response - The Express response object
 * @param {NextFunction} next - The Express next middleware function
 */
export const getSettingsHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        // Retrieve the username from the request
        const { username }: { username: string } = request as any;

        // Start a transaction to handle multiple SQL queries
        await transaction(async (client) => {
            // Retrieve the vault ID for the given username
            const { rows: rowsWithId } = await queryClient(
                client,
                `SELECT "id" FROM "Vaults" WHERE "username" = $1;`,
                [username]
            );

            // If the vault is not found, return a 404 Not Found response
            if (!rowsWithId.length || !rowsWithId[0].id) {
                return sendClientSideError(
                    request,
                    response,
                    `Vault not found for username:${username}`,
                    404
                );
            }

            // Retrieve the vault ID
            const vaultId = rowsWithId[0].id;

            // Retrieve the settings for the vault
            const { rows: settingsRows } = await queryClient(
                client,
                `SELECT "autoLockTimeInterval","autoLockOnSiteRefresh" FROM "Settings" WHERE "vaultId" = $1;`,
                [vaultId]
            );

            // If the settings are not found, return a 404 Not Found response
            if (settingsRows.length === 0) {
                return sendClientSideError(
                    request,
                    response,
                    `Settings not found for username:${username}`,
                    404
                );
            }

            // Extract the settings from the query result
            const settings = settingsRows[0];

            // Return a success response with the settings
            return sendSuccessResponse(
                request,
                response,
                "Settings fetched successfully!",
                200,
                { settings }
            );
        });
    } catch (err) {
        // If there's an error, call next(err) to pass it to the next middleware
        next(err);
    }
};

/**
 * Handles a request to update the settings for a given username.
 * @param request The Express request object.
 * @param response The Express response object.
 * @param next The Express next middleware function.
 */
export const updateSettingsHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        // Retrieve the username from the request
        const { username }: { username: string } = request as any;

        // Extract the settings from the request body
        const {
            settings,
        }: {
            settings: {
                autoLockTimeInterval: number;
                autoLockOnSiteRefresh: boolean;
            };
        } = request.body;

        // Start a transaction to handle multiple SQL queries
        await transaction(async (client) => {
            // Retrieve the vault ID for the given username
            const { rows: rowsWithId } = await queryClient(
                client,
                `SELECT "id" FROM "Vaults" WHERE "username" = $1;`,
                [username]
            );

            if (!rowsWithId.length || !rowsWithId[0].id) {
                // If the vault is not found, return a 404 Not Found response
                return sendClientSideError(
                    request,
                    response,
                    `Vault not found for username:${username}`,
                    404
                );
            }

            const vaultId = rowsWithId[0].id;

            // Update the settings for the vault
            await queryClient(
                client,
                `UPDATE "Settings" SET "autoLockTimeInterval" = $1, "autoLockOnSiteRefresh" = $2 WHERE "vaultId" = $3;`,
                [
                    settings.autoLockTimeInterval,
                    settings.autoLockOnSiteRefresh,
                    vaultId,
                ]
            );

            // Return a success response with a message
            return sendSuccessResponse(
                request,
                response,
                "Settings updated successfully!",
                200
            );
        });
    } catch (err) {
        // If there's an error, call next(err) to pass it to the next middleware
        next(err);
    }
};
