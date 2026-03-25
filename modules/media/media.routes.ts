import { Router } from "express";
import { mediaController } from "./media.controller";
import checkAuth from "../../src/lib/middlewares/checkAuth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

router.post("/add-media", checkAuth(Role.ADMIN), mediaController.addMedia);
router.get("/all-media", mediaController.getAllMedia);
router.get("/movies", mediaController.getMovie);
router.get("/series", mediaController.getSeries);
router.get("/animations", mediaController.getAnimation);
router.get("/:id", mediaController.getMediaById);




export const mediaRoutes = router;