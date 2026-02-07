import { Router } from "express";
import {
  createStudentRequest,
  findAllStudentRequests,
  findStudentRequestById,
  updateStudentRequest,
  deleteStudentRequest,
} from "../controller/studentRequest.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/createStudent",  createStudentRequest);

router.get("/getAllStudentData", verifyJWT, findAllStudentRequests);
router.get("/getStudentData", verifyJWT, findStudentRequestById);

router.delete("/deleteStudentRequest/:id", verifyJWT, deleteStudentRequest);

export default router;
