import { createNewVaultValidation } from "../validators/vaults";
import { createNewVaultHandler, getVaultHandler } from "../controllers/vaults";
import express from "express";

const router = express.Router();

router.route("/").get(getVaultHandler);

router.route("/").post(createNewVaultValidation, createNewVaultHandler);

export default router;
