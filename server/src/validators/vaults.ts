import { body } from "express-validator";
import { validateErrors } from "./validation";

export const updateVaultValidation = [
    body("vault")
        .exists()
        .withMessage("Vault is required")
        .isString()
        .withMessage("Vault must be a string"),
    validateErrors,
];
