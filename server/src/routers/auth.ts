import { loginValidation, registerValidation } from "../validators/auth";
import {
    authHandler,
    loginHandler,
    registerHandler,
} from "../controllers/auth";
import express from "express";
import { checkAuth } from "../middlewares/auth";

const router = express.Router();

router.route("/register").post(registerValidation, registerHandler);

router.route("/login").post(loginValidation, loginHandler);

router.route("/").get(checkAuth, authHandler);

export default router;
