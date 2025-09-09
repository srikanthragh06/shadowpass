import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import {
    globalErrorHandler,
    incorrectJSONFormatHandler,
} from "./middlewares/handlers";
import { sendSuccessResponse } from "./utils/responseTemplates";

const app = express(); // Create an Express application instance

// Enable CORS with credentials support to allow cross-origin requests with cookies
app.use(
    cors({
        credentials: true,
    })
);

// Apply compression to all responses to reduce payload size and improve performance
app.use(compression());

// Parse cookies from incoming requests
app.use(cookieParser());

// Parse incoming request bodies as JSON
app.use(bodyParser.json());

// Middleware to handle malformed JSON requests before hitting the routes
app.use(incorrectJSONFormatHandler);

// Define a simple test route that sends a standardized success response
app.get("/hi", (req, res, next) => {
    try {
        return sendSuccessResponse(req, res, "hey!");
    } catch (err) {
        next(err);
    }
});

// Apply the global error handler to catch errors from any route or middleware
app.use(globalErrorHandler);

export default app;
