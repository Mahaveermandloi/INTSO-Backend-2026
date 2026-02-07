import { Router } from "express";
import {
  deleteBannerImage,
  uploadBannerImage,
  getBannerData,
} from "../controller/banner.controller.js";
import {
  bannerUpload,
  imageCompressionMiddleware,
} from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import verifyAPIKey from "../middleware/verifyAPIKey.js";

const router = Router();

router
  .route("/upload-banner-image")
  .post(
    verifyJWT,
    bannerUpload.single("image"),
    uploadBannerImage
  );

router.route("/delete-banner-image/:id").delete(verifyJWT, deleteBannerImage);

router.get("/getBannerData", verifyAPIKey,  getBannerData);

export default router;
