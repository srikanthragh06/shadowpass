import { Request, Response } from "express";

/**
 * @function sendClientSideError
 * @description A response template for responding to client-side errors.
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 * @param {string} errMsg - The error message to be sent to the client.
 * @param {number} statusCode - The HTTP status code to be sent.
 * @returns {Response} The response object.
 */
export const sendClientSideError = (
    req: Request,
    res: Response,
    errMsg: string = "Invalid Request",
    statusCode: number = 400
) => {
    return res.status(statusCode).json({ error: errMsg });
};

/**
 * @function sendServerSideError
 * @description A response template for responding to server-side errors.
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 * @param {Error} err - The error object sent to the next middleware.
 * @param {number} statusCode - The HTTP status code to be sent.
 * @returns {Response} The response object.
 */
export const sendServerSideError = (
    req: Request,
    res: Response,
    err: Error,
    statusCode: number = 500
) => {
    return res.status(statusCode).json({ error: "Server Side Error" });
};

/**
 * @function sendSuccessResponse
 * @description A response template for sending a successful response back to the client.
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 * @param {string} message - The success message to be sent to the client.
 * @param {number} statusCode - The HTTP status code to be sent.
 * @param {Record<string, any>} additionals - An object containing any additional data to be sent.
 * @returns {Response} The response object.
 */
export const sendSuccessResponse = (
    req: Request,
    res: Response,
    message: string = "Request Successful",
    statusCode: number = 200,
    additionals: Record<string, any> = {}
) => {
    return res.status(statusCode).json({ message, ...additionals });
};
