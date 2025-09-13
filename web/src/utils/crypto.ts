/**
 * Converts an ArrayBuffer to a hexadecimal string.
 *
 * @param {ArrayBuffer} buffer - The buffer to convert.
 * @returns {string} - Hexadecimal representation of the buffer.
 */
const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
};

/**
 * Derives a cryptographic key from a password and salt using PBKDF2.
 *
 * @param {string} password - The password to derive from.
 * @param {string} salt - The salt value.
 * @param {number} [iterations=100000] - Number of PBKDF2 iterations.
 * @param {string} [hash="SHA-256"] - Hash algorithm to use.
 * @param {number} [keyLength=32] - Desired key length in bytes.
 * @returns {Promise<string>} - The derived key as a hex string.
 */
const deriveKey = async (
    password: string,
    salt: string,
    iterations = 100000,
    hash = "SHA-256",
    keyLength = 32
): Promise<string> => {
    const encoder = new TextEncoder();

    // Import the password as a CryptoKey
    const baseKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"]
    );

    // Derive bits using PBKDF2
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: encoder.encode(salt),
            iterations: iterations,
            hash: hash,
        },
        baseKey,
        keyLength * 8 // key length in bits
    );

    return bufferToHex(derivedBits);
};

/**
 * Generates a vault key for a user using their username and master password.
 *
 * @param {string} username - The user's username (used as salt).
 * @param {string} masterPassword - The user's master password.
 * @returns {Promise<string>} - The derived vault key as a hex string.
 */
export const generateVaultKey = async (
    username: string,
    masterPassword: string
) => {
    // Use a high iteration count for strong key derivation
    const vaultKey = await deriveKey(masterPassword, username, 1000000);
    return vaultKey;
};

/**
 * Generates a master token using the vault key and master password.
 *
 * @param {string} vaultKey - The derived vault key (used as salt).
 * @param {string} masterPassword - The user's master password.
 * @returns {Promise<string>} - The derived master token as a hex string.
 */
export const generateMasterToken = async (
    vaultKey: string,
    masterPassword: string
) => {
    const masterToken = await deriveKey(masterPassword, vaultKey);
    return masterToken;
};
