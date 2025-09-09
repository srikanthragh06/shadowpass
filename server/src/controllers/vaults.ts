import { NextFunction, Request, Response } from "express";
import { getAuthTokenFromHeader } from "../utils/authorization";
import {
    sendClientSideError,
    sendSuccessResponse,
} from "../utils/responseTemplates";
import { queryClient, transaction } from "../db/postgres";

/**
 * Handles the GET /vaults endpoint, which returns the vault associated with
 * the given auth token.
 * @param {Request} request - The express request object.
 * @param {Response} response - The express response object.
 * @param {NextFunction} next - The next middleware function to call.
 */
export const getVaultHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        /**
         * Get the auth token from the request headers.
         * This will be used to identify the user that is making the request.
         */
        const authToken = getAuthTokenFromHeader(request, response, next);

        /**
         * Run a transaction that will either return the vault associated with
         * the given auth token, or return an error if the vault does not exist.
         */
        await transaction(async (client) => {
            const { rows } = await queryClient(
                client,
                `SELECT vault FROM "Vaults" WHERE "authToken" = $1;`,
                [authToken]
            );

            /**
             * If the vault does not exist, return an error.
             */
            if (rows.length === 0 || !rows[0].vault)
                return sendClientSideError(
                    request,
                    response,
                    `Vault not found for authToken: ${authToken}!`,
                    401
                );

            /**
             * If the vault exists, return the vault to the client.
             */
            const vault = rows[0].vault;
            return sendSuccessResponse(
                request,
                response,
                "Vault retreived successfully!",
                200,
                { vault }
            );
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Handles the POST /vaults endpoint, which creates a new vault and
 * assigns it to the user with the given username.
 * @param {Request} request - The express request object.
 * @param {Response} response - The express response object.
 * @param {NextFunction} next - The next middleware function to call.
 */
export const createNewVaultHandler = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        /**
         * Extract the username from the request body.
         * This will be used to identify the user that the vault belongs to.
         */
        const { username }: { username: string } = request.body;

        /**
         * Get the auth token from the request headers.
         * This will be used to identify the user that is making the request.
         */
        const authToken = getAuthTokenFromHeader(request, response, next);

        /**
         * Run a transaction that will either create a new vault and assign it
         * to the user with the given username, or return an error if the
         * vault already exists.
         */
        await transaction(async (client) => {
            /**
             * Check if a vault with the given auth token already exists.
             * If it does, return an error.
             */
            const { rows: rowsWithAuthToken } = await queryClient(
                client,
                `SELECT 1 FROM "Vaults" WHERE "authToken" = $1;`,
                [authToken]
            );
            if (rowsWithAuthToken.length > 0)
                return sendClientSideError(
                    request,
                    response,
                    `Vault with authToken: ${authToken} already exists!`,
                    400
                );

            /**
             * Check if a vault with the given username already exists.
             * If it does, return an error.
             */
            const { rows: rowsWithUsername } = await queryClient(
                client,
                `SELECT 1 FROM "Vaults" WHERE "username" = $1;`,
                [username]
            );
            if (rowsWithUsername.length > 0)
                return sendClientSideError(
                    request,
                    response,
                    `Vault with username: ${username} already exists!`,
                    400
                );

            /**
             * Create a new vault and assign it to the user with the given username.
             */
            await queryClient(
                client,
                `INSERT INTO "Vaults" ("authToken","username") VALUES ($1,$2);`,
                [authToken, username]
            );

            /**
             * Return a success response with a message and a 200 status code.
             */
            return sendSuccessResponse(
                request,
                response,
                `Vault created successfully for user with username:${username}!`,
                200
            );
        });
    } catch (err) {
        /**
         * If an error occurs, call the next middleware function with the error.
         */
        next(err);
    }
};
