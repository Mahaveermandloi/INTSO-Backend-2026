import { Router } from "express";
import {
  createNewsUpdate,
  getAllArrays,
  deleteNewsUpdate,
  updateNews,
  getNews,
} from "../controller/newsAndUpdate.controller.js";
import {
  imageCompressionMiddleware,
  newsAndUpdateUpload,
} from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import verifyAPIKey from "../middleware/verifyAPIKey.js";

const router = Router();
router.post(
  "/upload-news-and-updates",
  newsAndUpdateUpload.single("image"),
  createNewsUpdate
);

router
  .route("/update-news-and-updates/:id")
  .put(
    verifyJWT,
    newsAndUpdateUpload.single("image"),
    imageCompressionMiddleware,
    updateNews
  );


router.get("/get-news-and-updates",verifyAPIKey ,  getAllArrays);

router
  .route("/delete-news-and-updates/:id")
  .delete(verifyJWT, deleteNewsUpdate);

export default router;
