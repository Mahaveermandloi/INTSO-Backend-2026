import { Router } from "express";

import { getHomeScreenData } from "../controller/home.controller.js";

const router = Router();

import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import verifyAPIKey from "../middleware/verifyAPIKey.js";

// router.post("/postCrousel", uploadFields, postCrouselData);

// router.post("/postTestimonial", upload.single("image"), PostTestimonialData);

router.get("/homeData",verifyAPIKey, getHomeScreenData);

export default router;
