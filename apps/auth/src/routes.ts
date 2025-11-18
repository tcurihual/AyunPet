import { Router } from "express";
import { loginController } from "./controllers/logincontroller";
import { logoutController } from "./controllers/logoutcontroller";

const router = Router();

router.post("/login", loginController);
router.post("/logout", logoutController);

export default router;