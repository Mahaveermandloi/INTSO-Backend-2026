import { db } from "../db/db.config.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Op } from "sequelize";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unlinkAsync = promisify(fs.unlink);
const Banner = db.bannerData;

const getBannerData = asyncHandler(async (req, res) => {
  const bannerData = await Banner.findAll();
  res.status(200).json(new ApiResponse(200, bannerData, "Banner data retrieved successfully"));
});

const uploadBannerImage = asyncHandler(async (req, res) => {
  const bannerImage = req.file;
  const { title, description, link } = req.body;

  if (!title || !description || !link) {
    throw new ApiError(400, "Bad Data: title, description, and link are required");
  }

  if (!bannerImage) {
    throw new ApiError(400, "Image not available");
  }

  const imagePath = `/uploads/banners/${bannerImage.filename}`;

  const bannerObject = {
    image: imagePath,
    title,
    description,
    link,
  };

  const data = await Banner.create(bannerObject);

  res.status(201).json(new ApiResponse(201, data, "Image uploaded successfully"));
});

const deleteBannerImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Banner ID is required");
  }

  const banner = await Banner.findByPk(id);
  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  const imagePath = banner.image;
  if (imagePath) {
    const fullPath = path.join(__dirname, "..", "uploads", "banners", path.basename(imagePath));
    console.log("Attempting to delete file at:", fullPath);
    try {
      await unlinkAsync(fullPath);
      console.log("Image file deleted successfully:", fullPath);
    } catch (err) {
      console.error("Error deleting image file:", err);
      throw new ApiError(500, "Error deleting image file");
    }
  } else {
    console.log("No image path found for banner");
  }

  const isDeleted = await Banner.destroy({ where: { id } });
  if (!isDeleted) {
    throw new ApiError(500, "Facing some issue deleting this banner");
  }

  res.status(200).json(new ApiResponse(200, {}, "Banner deleted successfully"));
});

export { deleteBannerImage, uploadBannerImage, getBannerData };
