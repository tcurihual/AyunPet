import { Router } from "express";
import { AdoptionRequestController } from "../controllers/adoptionRequestController";

const router = Router();

router.post("/", AdoptionRequestController.create);
router.get("/", AdoptionRequestController.getAll);
router.get("/:id", AdoptionRequestController.getById);
router.get("/user/:userid", AdoptionRequestController.getByUser);
router.get("/post/:postid", AdoptionRequestController.getByPost);
router.put("/:id", AdoptionRequestController.update);
router.delete("/:id", AdoptionRequestController.remove);

export default router;
