import { Router } from "express"
import usersRouter from "./users/routs"
import petsRouter from "./pets/routs"

const router = Router()

// Rutas para usuarios
router.use("/users", usersRouter)

// Rutas para mascotas
router.use("/pets", petsRouter)

export default router