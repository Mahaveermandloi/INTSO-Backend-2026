import { db } from "../db/db.config.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unlinkAsync = promisify(fs.unlink);

const GalleryList = db.gallaryData;

const PostGallery = asyncHandler(async (req, res) => {
  const { caption } = req.body;
  const gallery_img = req.file;

  if (!gallery_img) {
    throw new ApiError(400, "Please fill all required fields");
  }

  const gallaryObject = {
    gallery_img: `/uploads/gallery/${gallery_img.filename}`,
    caption,
  };

  const data = await GalleryList.create(gallaryObject);
  res
    .status(201)
    .json(new ApiResponse(201, data, "Gallery image created successfully"));
});

const getGallaryData = asyncHandler(async (req, res) => {
  const GallaryData = await GalleryList.findAll();
  res
    .status(200)
    .json(
      new ApiResponse(200, GallaryData, "Gallery data retrieved successfully")
    );
});

const deleteGalleryImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Image ID is required");
  }

  const galleryImage = await GalleryList.findByPk(id);
  if (!galleryImage) {
    throw new ApiError(404, "Image not found");
  }

  const imagePath = galleryImage.gallery_img;
  if (imagePath) {
    const fullPath = path.join(
      __dirname,
      "..",
      "uploads",
      "gallery",
      path.basename(imagePath)
    );
    console.log("Attempting to delete file at:", fullPath);
    try {
      await unlinkAsync(fullPath);
      console.log("Image file deleted successfully:", fullPath);
    } catch (err) {
      console.error("Error deleting image file:", err);
    }
  } else {
    console.log("No image path found for gallery image");
  }

  const isDeleted = await GalleryList.destroy({
    where: {
      id: id,
    },
  });

  if (!isDeleted) {
    throw new ApiError(500, "Facing some issue deleting this image");
  }

  res.status(200).json(new ApiResponse(200, {}, "Image deleted successfully"));
});

export { PostGallery, getGallaryData, deleteGalleryImage };
