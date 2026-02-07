import { Router } from "express";
import {
  createResource,
  deleteResource,
  getFreeResources,
  getPaidResources,
  getAllResourcesByAdmin,
  getAllDataByAdmin,
  getAllImages,
  getAllPdfs,
  getAllVideos,
  getPaidResourcesByUser,
} from "../controller/resources.controller.js";

import {
  imageCompressionMiddleware,
  upload,
} from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verifyUserJwt } from "../middleware/userAuth.middleware.js";
import verifyAPIKey from "../middleware/verifyAPIKey.js";
const router = Router();

router.post(
  "/create-resource",
  verifyJWT,

  upload.fields([
    { name: "resource_url" },
    { name: "thumbnail" },
    { name: "image" },
    { name: "pdf" },
  ]),
  imageCompressionMiddleware,
  createResource
);


router.get("/get-all-data-by-admin", getAllDataByAdmin);





router.get("/getResources", verifyAPIKey , verifyUserJwt, getPaidResources);
router.get("/get-all-resources-by-admin",  verifyAPIKey , getAllResourcesByAdmin);

router.get("/get-all-resources", verifyAPIKey, getFreeResources);

router.get("/get-paid-data-by-user",verifyAPIKey, getPaidResourcesByUser);

router.get("/getallimages", verifyAPIKey, getAllImages);
router.get("/getallpdfs", verifyAPIKey, getAllPdfs);
router.get("/getallvideos", verifyAPIKey, getAllVideos);

router.delete("/delete-resource/:id", verifyJWT, deleteResource);

export default router;
