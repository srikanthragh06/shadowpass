/**
 * Stores the JWT token in the browser's localStorage for authentication.
 *
 * @param {string} jwtToken - The JWT token to store.
 */
export const setJwtToken = (jwtToken: string) => {
    localStorage.setItem("jwtToken", jwtToken);
};
