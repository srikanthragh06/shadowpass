import { body } from "express-validator";
import { validateErrors } from "./validation";

export const createNewVaultValidation = [
    body("username")
        .exists()
        .withMessage("Username is required")
        .matches(/^[a-zA-Z0-9_]{4,32}$/)
        .withMessage(
            "Username must be 4-32 characters long and can only contain letters, numbers, and underscores."
        ),
    validateErrors,
];
