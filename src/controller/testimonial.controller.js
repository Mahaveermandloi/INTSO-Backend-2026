import { db } from "../db/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unlinkAsync = promisify(fs.unlink);

const Testimonial = db.testimonialData;

const PostTestimonialData = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const image = req.file;

  if (!image || !name || !description) {
    throw new ApiError(400, "Bad Data");
  }

  // Extract the file path from the uploaded file
  const imagePath = `/uploads/testimonial/${image.filename}`;

  // Create the testimonial object
  const dataObject = {
    image: imagePath,
    name,
    description,
  };

  // Log the data object to debug
  console.log("Creating testimonial with data:", dataObject);

  // Create testimonial in the database
  const data = await Testimonial.create(dataObject);

  // Send the created testimonial data as the response
  res
    .status(200)
    .json(new ApiResponse(200, { data }, "Testimonial created successfully"));
});

const getTestimonial = asyncHandler(async (req, res) => {
  const testimonialData = await Testimonial.findAll();

  if (!testimonialData) {
    throw new ApiError(403, "Testimonial Data Not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { testimonialData },
        "Testimonial Data sent successfully"
      )
    );
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    throw new ApiError(403, "Testimonial ID is required");
  }

  const testimonial = await Testimonial.findByPk(id);
  if (!testimonial) {
    throw new ApiError(404, "Testimonial not found");
  }

  const imagePath = testimonial.image;

  // Define a helper function to delete files
  const deleteFile = async (filePath) => {
    if (filePath) {
      const fullPath = path.join(__dirname, "..", filePath);
      console.log("Attempting to delete file at:", fullPath);
      try {
        await unlinkAsync(fullPath);
        console.log("File deleted successfully:", fullPath);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }
  };

  // Delete image file if it exists
  await deleteFile(imagePath);

  const isDeleted = await Testimonial.destroy({
    where: { id: id },
  });

  if (!isDeleted) {
    throw new ApiError(500, "Facing some issue deleting this testimonial");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Testimonial deleted successfully"));
});

export { PostTestimonialData, getTestimonial, deleteTestimonial };
