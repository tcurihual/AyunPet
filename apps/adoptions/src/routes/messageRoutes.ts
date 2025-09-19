import { Router } from "express";
import { MessageController } from "../controllers/messageController";

const router = Router();

router.post("/", MessageController.create);
router.get("/", MessageController.getAll);
router.get("/:id", MessageController.getById);
router.put("/:id", MessageController.update);
router.delete("/:id", MessageController.remove);

export default router;
