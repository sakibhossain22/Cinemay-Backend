import { Router } from "express";
import { mediaController } from "./media.controller";

const router = Router();

router.post("/add-media", mediaController.addMedia);
router.get("/all-media", mediaController.getAllMedia);
router.get("/media/:id", mediaController.getMediaById);
router.get("/movie", mediaController.getMovie);
router.get("/series", mediaController.getSeries);




export const mediaRoutes = router;