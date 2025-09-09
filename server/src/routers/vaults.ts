import { updateVaultValidation } from "../validators/vaults";
import {
    updateVaultHandler,
    deleteVaultHandler,
    getVaultHandler,
} from "../controllers/vaults";
import express from "express";
import { checkAuth } from "../middlewares/auth";

const router = express.Router();

router.route("/").get(checkAuth, getVaultHandler);

router.route("/").put(checkAuth, updateVaultValidation, updateVaultHandler);

router.route("/").delete(checkAuth, deleteVaultHandler);

export default router;
