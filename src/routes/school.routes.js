import { Router } from "express";

import {
  schoolRegistration,
  getSchoolsData,
  uploadSchool,
} from "../controller/school.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

import {
  getApprovedSchoolNames,
  getApprovedSchoolDetails,
} from "../controller/school.controller.js";

import {
  rejectSchool,
  approveSchool,
  deleteSchoolRequest,
  addToSchoolList,
} from "../controller/changeSchoolStatus.controller.js";

const router = Router();

router.post("/registerSchool", schoolRegistration);

router.put("/approveSchool/:school_id", verifyJWT, approveSchool);

// kal hi likha ye
router.delete(
  "/deleteSchoolRequest/:school_id",
  verifyJWT,
  deleteSchoolRequest
);

router.post("/addToSchoolList/:id", verifyJWT, addToSchoolList);

router.put("/rejectSchool/:school_id", verifyJWT, rejectSchool);

router.get("/getSchoolData", verifyJWT, getSchoolsData);

// router.post("/registerSchool", verifyJWT, schoolRegistration);

router.post("/uploadSchool", verifyJWT, uploadSchool);

router.get("/get-approved-schools", verifyJWT, getApprovedSchoolNames);

router.get("/getAll-approved-shools", verifyJWT, getApprovedSchoolDetails);

export default router;
