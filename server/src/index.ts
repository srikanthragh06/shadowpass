import app from "./app";
import http from "http";
import { SERVER_PORT } from "./config";
import { testDatabaseConnection } from "./db/postgres";

const server = http.createServer(app);

server.listen(SERVER_PORT, () => {
    console.log(`Server running on http://localhost:${SERVER_PORT}`);
    testDatabaseConnection();
});
