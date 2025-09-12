// userRoutes.ts
import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

// POST /api/users/register
router.post("/register", UserController.register);

export default router;
