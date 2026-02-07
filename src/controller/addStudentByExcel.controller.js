import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import xlsx from "xlsx";
import { db } from "../db/db.config.js";

const StudentList = db.studentListData;
const School = db.schoolData;

const saveStudentByExcel = asyncHandler(async (req, res) => {
  const { school_name } = req.body;

  if (!school_name) {
    throw new ApiError(400, "School name not provided.");
  }

  // Fetch the school ID based on the provided school name
  const school = await School.findOne({
    where: { school_name: school_name },
  });

  if (!school) {
    throw new ApiError(404, `${school_name} School is not found.`);
  }

  // Load the uploaded Excel file
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0]; // Assuming data is in the first sheet
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet);

  // Process and save each row of data into the database
  for (const row of data) {
    await StudentList.create({
      school_id: school.school_id,
      school_name: school_name,
      name: row.name,
      student_class: row.student_class,
      email: row.email,
      address: row.address,
      city: row.city,
      state: row.state,
      pincode: row.pincode,
      mobile_number: row.mobile_number,
      syllabus: row.syllabus,
      password: row.mobile_number,
    });
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Student list uploaded successfully"));
});

export { saveStudentByExcel };
