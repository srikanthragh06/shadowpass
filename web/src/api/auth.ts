import { callAPI } from "./api";

/**
 * The base URL for the backend API, loaded from environment variables.
 */
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Sends a registration request to the backend API to create a new user account.
 *
 * @param {any} body - The registration data (e.g., username, password, etc.).
 * @returns {Promise<any>} - Resolves with the API response or error object.
 */
export const registerAPI = async (body: any) => {
    return await callAPI(`${API_URL}/auth/register`, "POST", body, {});
};

/**
 * Sends a login request to the backend API to authenticate a user.
 *
 * @param {any} body - The login data (e.g., username, password, etc.).
 * @returns {Promise<any>} - Resolves with the API response or error object.
 */
export const loginAPI = async (body: any) => {
    return await callAPI(`${API_URL}/auth/login`, "POST", body, {});
};
