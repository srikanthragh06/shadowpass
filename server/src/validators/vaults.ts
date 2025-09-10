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

export const changeMasterPasswordValidation = [
    body("masterToken")
        .exists()
        .withMessage("MasterToken is required")
        .isString()
        .withMessage("MasterToken must be a string"),
    validateErrors,
];
