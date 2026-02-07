import { db } from "../db/db.config.js";
import fs from "fs";
import ExcelJS from "exceljs";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const Student = db.studentrequestData;
const School = db.schoolData;
const StudentList = db.studentListData;

const matchAndSaveStudent = asyncHandler(async (req, res) => {
  const { id } = req.params; // Assuming you're passing the student ID as a parameter
  const { school_name } = req.body;

  // Find the student by ID
  const student = await Student.findByPk(id);

  console.log(student);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  // Find the school by schoolId
  const school = await School.findOne({
    where: { school_name: school_name },
  });

  if (!school) {
    return res.status(404).json({ message: "School not found" });
  }

  // Check if the student already exists in StudentList
  const existingEntry = await StudentList.findOne({
    where: { email: student.email },
  });

  if (existingEntry) {
    return res
      .status(409)
      .json({ message: "Student already exists in Student List" });
  }

  // Create new entry in StudentList
  const data = await StudentList.create({
    school_id: school.school_id,
    school_name: school.school_name,
    student_class: student.student_class,
    name: student.name,
    email: student.email,
    address: student.address,
    city: student.city,
    state: student.state,
    pincode: student.pincode,
    mobile_number: student.mobile_number,
    syllabus: student.syllabus,
    password: student.mobile_number.toString(), // Example: using mobile number as password (this might need reconsideration)
  });

  // Send response with created student entry
  const createdStudent = await StudentList.findByPk(data.id, {
    attributes: { exclude: ["password"] },
  });

  res.status(200).json({ createdStudent });
});

const getStudentsBySchoolAndClass = asyncHandler(async (req, res) => {
  const { school_name, student_class } = req.body;

  if (!school_name || !student_class) {
    throw new ApiError(400, "School name and class are required");
  }

  const students = await StudentList.findAll({
    where: {
      school_name: school_name,
      student_class: student_class,
    },
  });

  if (students.length === 0) {
    throw new ApiError(404, "No students found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, students, "Students retrieved successfully"));
});

const getAllStudents = asyncHandler(async (req, res) => {
  const students = await StudentList.findAll();

  if (students.length === 0) {
    throw new ApiError(404, "No students found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, students, "All students retrieved successfully")
    );
});

const downloadFormat = asyncHandler(async (req, res) => {
  const headers = [
    "name",
    "student_class",
    "email",
    "address",
    "city",
    "state",
    "pincode",
    "mobile_number",
    "syllabus",
  ];

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Student List");
  ws.addRow(headers);
  const filePath = "./template.xlsx";
  await wb.xlsx.writeFile(filePath);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=template.xlsx");

  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);

  fileStream.on("end", () => {
    fs.unlinkSync(filePath);
  });
});

export {
  matchAndSaveStudent,
  getAllStudents,
  getStudentsBySchoolAndClass,
  downloadFormat,
};
