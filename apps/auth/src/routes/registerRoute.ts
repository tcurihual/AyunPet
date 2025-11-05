import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

// Ruta de registro
router.post("/register", UserController.register);

// Ruta de salud para probar que el endpoint está disponible
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "auth-users",
    timestamp: new Date().toISOString(),
    endpoints: {
      register: "POST /api/auth/users/register"
    }
  });
});

export default router;