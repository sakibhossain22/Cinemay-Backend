import { Router } from "express";
import { mediaController } from "./media.controller";

const router = Router();

router.post("/add-media", mediaController.addMedia);




export const mediaRoutes = router;