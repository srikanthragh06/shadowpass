import { Pool, PoolClient, QueryResult } from "pg";
import {
    PG_MAX_RETRIES,
    PG_RETRY_DELAY_MS,
    PG_USERNAME,
    PG_PASSWORD,
    PG_HOST,
    PG_PORT,
    PG_DB,
} from "../config";

export const pool = new Pool({
    user: PG_USERNAME,
    password: PG_PASSWORD,
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DB,
    ssl: { rejectUnauthorized: false },
    max: 20,
});

/**
 * Tests the database connection to the Postgres Database.
 * This function attempts to connect to the database, run a simple query and
 * then close the connection. If the connection is successful, a success message
 * is logged to the console. If the connection is not successful, an error message
 * is logged to the console and the error is logged as well.
 */
export const testDatabaseConnection = async (retries = PG_MAX_RETRIES) => {
    try {
        const client = await pool.connect();

        try {
            // Run a simple query to check if the connection is successful
            await client.query("SELECT 1");

            // Log a success message if the connection was successful
            console.log(
                `Database connection to Postgres Database: ${PG_DB} successful :)`
            );
        } finally {
            // Release the connection
            client.release();
        }
    } catch (error) {
        // try the connection again and again until retries are over
        if (retries > 0) {
            console.log(
                `Database connection failed. Retrying in ${
                    PG_RETRY_DELAY_MS / 1000
                }s... (${PG_MAX_RETRIES - retries + 1}/${PG_MAX_RETRIES})`
            );
            setTimeout(
                () => testDatabaseConnection(retries - 1),
                PG_RETRY_DELAY_MS
            );
        } else {
            throw new Error(
                "Database connection failed after multiple attempts."
            );
        }
    }
};

/**
 * Executes a SQL query using the provided database client.
 * @param client The database client to use for executing the query.
 * @param query The SQL query string to execute.
 * @param params Optional parameters for the SQL query. Defaults to null.
 * @returns A promise that resolves to the result of the query.
 */
export const queryClient = async (
    client: PoolClient,
    query: string,
    params: any[] | null = null
): Promise<QueryResult> => {
    // Determine whether to execute the query with or without parameters
    const result = params
        ? await client.query(query, params) // Execute query with parameters
        : await client.query(query); // Execute query without parameters
    return result;
};

/**
 * Executes a sequence of database operations as a single transaction.
 * @param operations A function that takes a database client and returns a
 * promise that resolves when all operations are complete. The function should
 * not release the client.
 * @returns A promise that resolves when all operations are complete and the
 * transaction is committed, or throws an error if the transaction fails.
 */
export const transaction = async (
    operations: (client: PoolClient) => Promise<any>
): Promise<void> => {
    try {
        const client: PoolClient = await pool.connect();
        try {
            // Start a new transaction, execute operations and commit transaction
            await queryClient(client, "BEGIN");
            await operations(client);
            await queryClient(client, "COMMIT");
            client.release();
        } catch (err) {
            // Rollback the transaction and throw error if an error occurs
            await client.query("ROLLBACK");
            client.release();
            throw err;
        }
    } catch (err) {
        // Throw any error that occurs
        throw err;
    }
};
