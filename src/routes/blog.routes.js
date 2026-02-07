import { Router } from "express";
import {
  PostBlogData,
  deleteBlogs,
  getAllBlogDetails,
  getBlogDetails,
  editBlogDetails,
  updateBlogDetails,
} from "../controller/blog.controller.js";

import {
  blogUpload,
  imageCompressionMiddleware,
} from "../middleware/multer.middleware.js";
import { getHomeScreenData } from "../controller/home.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import verifyAPIKey from "../middleware/verifyAPIKey.js";

const router = Router();
router.post(
  "/post-blogs",
  verifyJWT,

  blogUpload.single("image"),
  imageCompressionMiddleware,
  PostBlogData
);

// router.get("/get-all-blogs", getHomeScreenData);
router.get("/get-blog-details/:permalink", verifyAPIKey, getBlogDetails);

router.get("/get-all-blog-details", verifyAPIKey, getAllBlogDetails);

router.get("/get-edit-blog-details/:id", verifyJWT, editBlogDetails);

router.put(
  "/update-blog-details/:id",
  blogUpload.single("image"),
  verifyJWT,
  imageCompressionMiddleware,
  updateBlogDetails
);

router.delete("/delete-blogs/:id", verifyJWT, deleteBlogs);

export default router;
