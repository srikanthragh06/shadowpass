import {
    changeMasterPasswordValidation,
    updateVaultValidation,
} from "../validators/vaults";
import {
    updateVaultHandler,
    deleteVaultHandler,
    getVaultHandler,
    changeMasterPasswordHandler,
} from "../controllers/vaults";
import express from "express";
import { checkAuth } from "../middlewares/auth";

const router = express.Router();

router.route("/").get(checkAuth, getVaultHandler);

router.route("/").put(checkAuth, updateVaultValidation, updateVaultHandler);

router.route("/").delete(checkAuth, deleteVaultHandler);

router
    .route("/changeMasterPassword")
    .put(
        checkAuth,
        changeMasterPasswordValidation,
        changeMasterPasswordHandler
    );

export default router;
