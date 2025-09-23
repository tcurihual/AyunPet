import { Router } from "express";
import { PasswordController } from "../controllers/passwordController";

const router = Router();

router.post("/request-password-reset", PasswordController.requestPasswordReset);

export default router;
