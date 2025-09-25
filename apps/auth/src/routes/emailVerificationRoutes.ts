import { Router } from "express";
import { EmailVerificationController } from "../controllers/emailVerificationController";

const router = Router();

router.post("/request-email-verification", EmailVerificationController.requestEmailVerification);
router.post("/verify-email", EmailVerificationController.verifyEmail);

export default router;