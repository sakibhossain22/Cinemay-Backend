import { Router } from "express";
import { mediaController } from "./media.controller";

const router = Router();

router.post("/add-media", mediaController.addMedia);
router.get("/all-media", mediaController.getAllMedia);
router.get("/movies", mediaController.getMovie);
router.get("/series", mediaController.getSeries);
router.get("/:id", mediaController.getMediaById);




export const mediaRoutes = router;