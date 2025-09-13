import axios from "axios";

/**
 * Supported HTTP methods for API calls.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * Makes an HTTP request to the specified API endpoint using axios.
 *
 * @param {string} url - The endpoint URL to call.
 * @param {HttpMethod} [method="GET"] - The HTTP method to use (GET, POST, PUT, DELETE).
 * @param {any} [body] - The request body or query parameters (for GET).
 * @param {Record<string, string>} [headers] - Optional headers to include in the request.
 * @returns {Promise<any>} - Resolves with an object containing the response data and status, or error info.
 */
export const callAPI = async (
    url: string,
    method: HttpMethod = "GET",
    body?: any,
    headers?: Record<string, string>
): Promise<any> => {
    try {
        // Build axios config object
        const axiosConfig: any = {
            url,
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
        };

        // For GET requests, use query parameters; otherwise, use request body
        if (method === "GET") {
            axiosConfig.params = body;
        } else {
            axiosConfig.data = body;
        }

        // Make the HTTP request
        const response = await axios(axiosConfig);

        return { data: response.data, status: response.status };
    } catch (error: any) {
        console.error("API call error:", error);

        // Handle different error scenarios
        if (error.response?.data?.error) {
            // API returned an error message
            return {
                error: error.response.data.error,
                status: error.response.status,
            };
        } else if (error.request) {
            // No response received from server
            return { error: "No response from server" };
        } else {
            // Other errors (e.g., network issues)
            return { error: error.message };
        }
    }
};
