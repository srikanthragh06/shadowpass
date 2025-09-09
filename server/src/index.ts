import app from "./app";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer(app);

const SERVER_PORT = process.env.SERVER_PORT;
if (SERVER_PORT) {
    server.listen(SERVER_PORT, () => {
        console.log(`Server running on http://localhost:${SERVER_PORT}`);
    });
} else {
    throw new Error("SERVER_PORT is not defined");
}
