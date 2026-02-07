// routes/studentList.js
import express from "express";
import { saveStudentByExcel } from "../controller/addStudentByExcel.controller.js";
import multer from "multer";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/uploadstudentlist",
  verifyJWT,
  upload.single("file"),
  saveStudentByExcel
);

export default router;
