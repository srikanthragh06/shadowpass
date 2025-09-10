import { body } from "express-validator";
import { validateErrors } from "./validation";

export const updateSettingsValidation = [
    body("settings").exists().withMessage("Settings object is required"),
    body("settings.autoLockTimeInterval")
        .exists()
        .withMessage("Auto lock time interval is required")
        .isInt({ min: 0 })
        .withMessage("Auto lock time interval must be a non-negative integer"),
    body("settings.autoLockOnSiteRefresh")
        .exists()
        .withMessage("Auto lock on site refresh is required")
        .isBoolean()
        .withMessage("Auto lock on site refresh must be a boolean"),
    validateErrors,
];
