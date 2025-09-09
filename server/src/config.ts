import dotenv from "dotenv";

dotenv.config();

// Check for required environment variables
const requiredEnv = [
    "MODE",
    "SERVER_PORT",
    "PG_MAX_RETRIES",
    "PG_RETRY_DELAY_MS",
    "PG_USERNAME",
    "PG_PASSWORD",
    "PG_HOST",
    "PG_PORT",
    "PG_DB",
    "JWT_SECRET",
];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

// Export config with validated environment variables
export const MODE = process.env.MODE!;
export const SERVER_PORT = Number(process.env.SERVER_PORT!);
export const PG_MAX_RETRIES = Number(process.env.PG_MAX_RETRIES!);
export const PG_RETRY_DELAY_MS = Number(process.env.PG_RETRY_DELAY_MS!);
export const PG_USERNAME = process.env.PG_USERNAME!;
export const PG_PASSWORD = process.env.PG_PASSWORD!;
export const PG_HOST = process.env.PG_HOST!;
export const PG_PORT = Number(process.env.PG_PORT!);
export const PG_DB = process.env.PG_DB!;
export const JWT_SECRET = process.env.JWT_SECRET!;
