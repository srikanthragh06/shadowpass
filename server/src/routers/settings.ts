import {
    getSettingsHandler,
    updateSettingsHandler,
} from "../controllers/settings";
import express from "express";
import { checkAuth } from "../middlewares/auth";
import { updateSettingsValidation } from "../validators/settings";

const router = express.Router();

router.route("/").get(checkAuth, getSettingsHandler);

router
    .route("/")
    .put(checkAuth, updateSettingsValidation, updateSettingsHandler);

export default router;
