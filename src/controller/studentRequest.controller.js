import { db } from "../db/db.config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const StudentRequest = db.studentrequestData;

const createStudentRequest = asyncHandler(async (req, res) => {
  const {
    student_class,
    name,
    email,
    address,
    city,
    state,
    pincode,
    mobile_number,
    school_name,
    syllabus,
  } = req.body;

  console.log(
    student_class,
    name,
    email,
    address,
    city,
    state,
    pincode,
    mobile_number,
    school_name,
    syllabus
  );

  // Validate required fields
  if (
    !name ||
    !student_class ||
    !email ||
    !address ||
    !city ||
    !state ||
    !pincode ||
    !mobile_number ||
    !school_name ||
    !syllabus
  ) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields" });
  }

  console.log(
    student_class,
    name,
    email,
    address,
    city,
    state,
    pincode,
    mobile_number,
    school_name,
    syllabus
  );

  // Validate email format
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  // Validate mobile number format (must be exactly 10 digits)
  const mobileNumberRegex = /^\d{10}$/;
  if (!mobileNumberRegex.test(mobile_number)) {
    return res
      .status(400)
      .json({ message: "Mobile number must be exactly 10 digits long" });
  }

  // Check if the email already exists

  const existingStudent = await StudentRequest.findOne({
    where: { email: email },
  });

  console.log(existingStudent);
  

  if (existingStudent) {
    return res.status(409).json({ message: "Email already exists" });
  }

  // Create student request object
  const studentObject = {
    student_class,
    name,
    email,
    address,
    city,
    state,
    pincode,
    mobile_number,
    school_name,
    syllabus,
  };

  // Log the student object to debug
  console.log("Creating student request with data:", studentObject);

  // Create student request in the database
  const data = await StudentRequest.create(studentObject);

  // Send the created student request data as the response
  res
    .status(201)
    .json(new ApiResponse(201, { data }, "Data returned successfully!!!"));
});

const findAllStudentRequests = asyncHandler(async (req, res) => {
  const studentRequests = await StudentRequest.findAll();
  if (!studentRequests) {
    throw new ApiError(400, "No student Data");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        studentRequests,
        "Student requests retrieved successfully"
      )
    );
});

const findStudentRequestById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const studentRequest = await StudentRequest.findByPk(id);
  if (studentRequest) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          studentRequest,
          "Student request retrieved successfully"
        )
      );
  } else {
    throw new ApiError(404, `Cannot find student request with id=${id}.`);
  }
});

const updateStudentRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const [updated] = await StudentRequest.update(req.body, {
    where: { id: id },
  });
  if (updated) {
    const updatedStudentRequest = await StudentRequest.findByPk(id);
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedStudentRequest,
          "Student request updated successfully"
        )
      );
  } else {
    throw new ApiError(
      404,
      `Cannot update student request with id=${id}. Maybe student request was not found or req.body is empty!`
    );
  }
});

const deleteStudentRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await StudentRequest.destroy({
    where: { id: id },
  });
  if (deleted) {
    res.status(200).json(
      new ApiResponse(200, {
        message: "Student request was deleted successfully!",
      })
    );
  } else {
    throw new ApiError(
      404,
      `Cannot delete student request with id=${id}. Maybe student request was not found!`
    );
  }
});

export {
  createStudentRequest,
  findAllStudentRequests,
  findStudentRequestById,
  updateStudentRequest,
  deleteStudentRequest,
};
