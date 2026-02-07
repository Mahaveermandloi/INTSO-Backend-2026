import { Router } from "express";
import {
  PostGallery,
  getGallaryData,
  deleteGalleryImage,
} from "../controller/gallary.controller.js";

import {
  imageCompressionMiddleware,
  upload,
} from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import verifyAPIKey from "../middleware/verifyAPIKey.js"

const router = Router();
router.post(
  "/postGallery",
  verifyJWT,
  upload.single("gallery_img"),
  imageCompressionMiddleware,
  PostGallery
);
router.delete("/deleteGalleryImage/:id", verifyJWT, deleteGalleryImage);

router.get("/getGallery", verifyAPIKey, getGallaryData);

export default router;
