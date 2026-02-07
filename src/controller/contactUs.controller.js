import { db } from "../db/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const Contact = db.contactData;

// const postcontactUs = asyncHandler(async (req, res) => {
//   const { name, email, mobile_number, message } = req.body;

//   console.log(name, email, mobile_number, message);

//   if (!name || !email || !mobile_number || !message) {
//     throw new ApiError(400, "fill in all required fields");
//   }

//   // Create contact object
//   const contactUsObject = {
//     name,
//     email,
//     mobile_number,
//     message,
//   };

//   // Create contact in the database using contactUsObject
//   const data = await Contact.create(contactUsObject);

//   // Send the created contact data as the response
//   res
//     .status(201)
//     .json(new ApiResponse(201, data, "Contact created successfully"));
// });

const postcontactUs = asyncHandler(async (req, res) => {
  const { name, email, mobile_number, message } = req.body;

  console.log(name, email, mobile_number, message);

  // Validate required fields
  if (!name || !email || !mobile_number || !message) {
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

  // Create contact object
  const contactObject = {
    name,
    email,
    mobile_number,
    message,
  };

  // Log the contact object to debug
  console.log("Creating contact with data:", contactObject);

  try {
    // Create contact in the database
    const data = await Contact.create(contactObject);

    // Send the created contact data as the response
    res.status(201).json({ message: "Contact created successfully", data });
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({ message: "Failed to create contact" });
  }
});

const getContactUsDetails = asyncHandler(async (req, res) => {
  const contactUs = await Contact.findAll();

  if (!contactUs || contactUs.length === 0) {
    throw new ApiError(404, "No Contacts Available");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { contactUs },
        "Contact Us data returned successfully"
      )
    );
});

export { postcontactUs, getContactUsDetails };
