import { callAPI } from "./api";

/**
 * Sends a registration request to the backend API to create a new user account.
 *
 * @param {any} body - The registration data (e.g., username, password, etc.).
 * @returns {Promise<any>} - Resolves with the API response or error object.
 */
export const registerAPI = async (body: any) => {
    return await callAPI(
        "http://localhost:5000/auth/register",
        "POST",
        body,
        {}
    );
};
