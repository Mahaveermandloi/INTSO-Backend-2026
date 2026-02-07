import { db } from "../db/db.config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Op } from "sequelize";

const schoolList = db.schoolData;

// const schoolRegistration = asyncHandler(async (req, res) => {
//   const {
//     school_name,
//     email,
//     address,
//     city,
//     state,
//     district,
//     pincode,
//     STD_code,
//     landline,
//     mobile_number,
//     principal_name_prefix,
//     principal_name,
//     syllabus,
//   } = req.body;

//   if (
//     !school_name ||
//     !email ||
//     !address ||
//     !city ||
//     !state ||
//     !district ||
//     !STD_code ||
//     !pincode ||
//     !landline ||
//     !mobile_number ||
//     !principal_name_prefix ||
//     !principal_name ||
//     !syllabus
//   ) {
//     throw new ApiError(400, "Fill in all the details");
//   }

//   const existingSchool = await schoolList.findOne({ where: { email: email } });
//   if (existingSchool) {
//     throw new ApiError(409, "Email already exists");
//   }

//   const schoolObject = {
//     school_name,
//     email,
//     address,
//     city,
//     state,
//     district,
//     STD_code,
//     landline,
//     pincode,
//     mobile_number,
//     principal_name_prefix,
//     principal_name,
//     syllabus,
//   };

//   const data = await schoolList.create(schoolObject);

//   res
//     .status(201)
//     .json(new ApiResponse(201, { data }, "Data returned successfully"));
// });

const schoolRegistration = asyncHandler(async (req, res) => {
  const {
    school_name,
    email,
    address,
    city,
    state,
    district,
    pincode,
    STD_code,
    landline,
    mobile_number,
    principal_name_prefix,
    principal_name,
    syllabus,
  } = req.body;

  console.log(
    school_name,
    email,
    address,
    city,
    state,
    district,
    pincode,
    STD_code,
    landline,
    mobile_number,
    principal_name_prefix,
    principal_name,
    syllabus
  );

  // Validate required fields
  if (
    !school_name ||
    !email ||
    !address ||
    !city ||
    !state ||
    !district ||
    !STD_code ||
    !pincode ||
    !landline ||
    !mobile_number ||
    !principal_name_prefix ||
    !principal_name ||
    !syllabus
  ) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields" });
  }

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
  const existingSchool = await schoolList.findOne({ where: { email: email } });
  if (existingSchool) {
    return res.status(409).json({ message: "Email already exists" });
  }

  // Create school object
  const schoolObject = {
    school_name,
    email,
    address,
    city,
    state,
    district,
    STD_code,
    pincode,
    landline,
    mobile_number,
    principal_name_prefix,
    principal_name,
    syllabus,
  };

  // Log the school object to debug
  console.log("Creating school registration with data:", schoolObject);

  try {
    // Create school registration in the database
    const data = await schoolList.create(schoolObject);

    // Send the created school registration data as the response
    res
      .status(201)
      .json(new ApiResponse(201, { data }, "Data returned successfully"));
  } catch (error) {
    console.error("Error creating school registration:", error);
    return res
      .status(500)
      .json({ message: "Failed to create school registration" });
  }
});

const getSchoolsData = asyncHandler(async (req, res) => {
  const getData = await schoolList.findAll();

  if (!getData) {
    throw new ApiError(400, "Data not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { getData }, "Data sent successfully"));
});

const getApprovedSchoolNames = asyncHandler(async (req, res) => {
  const approvedSchools = await schoolList.findAll({
    where: { status: "approved" },
    attributes: ["school_name"],
  });

  const schoolDetails = approvedSchools.map((school) => ({
    school_name: school.school_name,
    school_id: school.school_id,
  }));

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        schoolDetails,
        "Approved schools fetched successfully"
      )
    );
});

const getApprovedSchoolDetails = asyncHandler(async (req, res) => {
  const approvedSchools = await schoolList.findAll({
    where: { status: "approved" },
  });

  if (approvedSchools.length === 0) {
    throw new ApiError(404, "No approved schools found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        approvedSchools,
        "Approved schools fetched successfully"
      )
    );
});

// const uploadSchool = asyncHandler(async (req, res) => {

//   const {
//     school_name,
//     email,
//     address,
//     city,
//     state,
//     district,
//     pincode,
//     STD_code,
//     landline,
//     mobile_number,
//     principal_name_prefix,
//     principal_name,
//     syllabus,
//   } = req.body;

//   console.log(
//     school_name,
//     email,
//     address,
//     city,
//     state,
//     district,
//     pincode,
//     STD_code,
//     landline,
//     mobile_number,
//     principal_name_prefix,
//     principal_name,
//     syllabus
//   );

//   // Validate required fields
//   if (
//     !school_name ||
//     !email ||
//     !address ||
//     !city ||
//     !state ||
//     !district ||
//     !STD_code ||
//     !pincode ||
//     !landline ||
//     !mobile_number ||
//     !principal_name_prefix ||
//     !principal_name ||
//     !syllabus
//   ) {
//     return res
//       .status(400)
//       .json({ message: "Please fill in all required fields" });
//   }

//   // Validate email format
//   const emailRegex = /\S+@\S+\.\S+/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).json({ message: "Invalid email address" });
//   }

//   // Validate mobile number format (must be exactly 10 digits)
//   const mobileNumberRegex = /^\d{10}$/;
//   if (!mobileNumberRegex.test(mobile_number)) {
//     return res
//       .status(400)
//       .json({ message: "Mobile number must be exactly 10 digits long" });
//   }

//   // Check if the email already exists
//   const existingSchool = await schoolList.findOne({ where: { email: email } });
//   if (existingSchool) {
//     return res.status(409).json({ message: "Email already exists" });
//   }

//   // Create school object
//   const schoolObject = {
//     school_name,
//     email,
//     address,
//     city,
//     state,
//     district,
//     STD_code,
//     pincode,
//     landline,
//     mobile_number,
//     principal_name_prefix,
//     principal_name,
//     syllabus,
//   };

//   // Log the school object to debug
//   console.log("Creating school registration with data:", schoolObject);

//   try {
//     // Create school registration in the database
//     const data = await schoolList.create(schoolObject);

//     // Send the created school registration data as the response
//     res
//       .status(201)
//       .json(new ApiResponse(201, { data }, "Data returned successfully"));
//   } catch (error) {
//     console.error("Error creating school registration:", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to create school registration" });
//   }

// });

const uploadSchool = asyncHandler(async (req, res) => {
  const {
    school_name,
    email,
    address,
    city,
    state,
    district,
    pincode,
    STD_code,
    landline,
    mobile_number,
    principal_name_prefix,
    principal_name,
    syllabus,
  } = req.body;

  console.log(
    school_name,
    email,
    address,
    city,
    state,
    district,
    pincode,
    STD_code,
    landline,
    mobile_number,
    principal_name_prefix,
    principal_name,
    syllabus
  );

  // Validate required fields
  if (
    !school_name ||
    !email ||
    !address ||
    !city ||
    !state ||
    !district ||
    !STD_code ||
    !pincode ||
    !landline ||
    !mobile_number ||
    !principal_name_prefix ||
    !principal_name ||
    !syllabus
  ) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields" });
  }

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
  const existingSchool = await schoolList.findOne({ where: { email: email } });
  if (existingSchool) {
    return res.status(409).json({ message: "Email already exists" });
  }

  // Create school object
  const schoolObject = {
    school_name,
    email,
    address,
    city,
    state,
    district,
    STD_code,
    pincode,
    landline,
    mobile_number,
    principal_name_prefix,
    principal_name,
    syllabus,
  };

  // Log the school object to debug
  console.log("Creating school registration with data:", schoolObject);

  try {
    // Create school registration in the database
    const data = await schoolList.create(schoolObject);

    // Send the created school registration data as the response
    res
      .status(201)
      .json(new ApiResponse(201, { data }, "School registered successfully"));
  } catch (error) {
    console.error("Error creating school registration:", error);
    return res
      .status(500)
      .json({ message: "Failed to create school registration" });
  }
});

export {
  schoolRegistration,
  getSchoolsData,
  getApprovedSchoolNames,
  getApprovedSchoolDetails,
  uploadSchool,
};
