import { Router } from "express";

import {
  matchAndSaveStudent,
  getStudentsBySchoolAndClass,
  getAllStudents,
  downloadFormat,
} from "../controller/studentList.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/createStudentList/:id", verifyJWT, matchAndSaveStudent);
router.get("/getBySchoooNameAndClass", verifyJWT, getStudentsBySchoolAndClass);

router.get("/getAllStudents", verifyJWT, getAllStudents);

router.get("/downloadFormat", verifyJWT, downloadFormat);

export default router;
