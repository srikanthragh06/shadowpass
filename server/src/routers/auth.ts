import { loginValidation, registerValidation } from "../validators/auth";
import { loginHandler, registerHandler } from "../controllers/auth";
import express from "express";

const router = express.Router();

router.route("/register").post(registerValidation, registerHandler);

router.route("/login").post(loginValidation, loginHandler);

export default router;
