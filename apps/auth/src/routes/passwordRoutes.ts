import { Router } from "express";
import { PasswordController } from "../controllers/passwordController";
import { ResetPasswordController } from "../controllers/resetPasswordController";

const router = Router();

router.post("/request-password-reset", PasswordController.requestPasswordReset);

router.post("/reset-password", ResetPasswordController.resetPassword);

export default router;