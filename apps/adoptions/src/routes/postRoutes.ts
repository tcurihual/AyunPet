import { Router } from "express";
import { PostController } from "../controllers/postController";

const router = Router();

router.post("/", PostController.create);
router.get("/", PostController.getAll);
router.get("/:id", PostController.getById);
router.put("/:id", PostController.update);
router.delete("/:id", PostController.remove);

export default router;
