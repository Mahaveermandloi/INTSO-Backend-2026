import { Router } from "express";
// import { postcontactUs } from "../controller/contactUs.controllers.js";
import {
  getContactUsDetails,
  postcontactUs,
} from "../controller/contactUs.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/postContact", postcontactUs);
router.get("/getContactDetails", verifyJWT, getContactUsDetails);


export default router;
