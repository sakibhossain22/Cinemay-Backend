import { Router } from "express";
import { mediaController } from "./media.controller";

const router = Router();

router.post("/add-media", mediaController.addMedia);
router.get("/all-media", mediaController.getAllMedia);




export const mediaRoutes = router;