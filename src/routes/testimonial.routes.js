import { Router } from "express";
import {
  PostTestimonialData,
  getTestimonial,
  deleteTestimonial,
} from "../controller/testimonial.controller.js";
import {
  imageCompressionMiddleware,
  testimonialUpload,
} from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import verifyAPIKey from "../middleware/verifyAPIKey.js";
const router = Router();

router.post(
  "/post-testimonial",
  verifyJWT,
  testimonialUpload.single("image"),
  imageCompressionMiddleware,
  PostTestimonialData
);

router.get("/get-testimonial", verifyAPIKey, getTestimonial);

router.delete("/delete-testimonial/:id", verifyJWT, deleteTestimonial);

export default router;
