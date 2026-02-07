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
const NewsAndUpdates = db.newsAndupdateData;

const createNewsUpdate = asyncHandler(async (req, res) => {
  const { title, description, posted_By, post_Type, event_Date, event_Time } =
    req.body;
  const image = req.file;

  if (!image || !title || !description || !posted_By || !post_Type) {
    throw new ApiError(400, "Required fields are missing");
  }

  const data = await NewsAndUpdates.create({
    image: `/uploads/newsandupdate/${image.filename}`,
    title,
    description,
    posted_By,
    post_Type,
    event_Date: event_Date || null,
    event_Time: event_Time || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  res
    .status(201)
    .json(new ApiResponse(201, data, "News update created successfully"));
});

const getAllArrays = asyncHandler(async (req, res) => {
  const allNewsUpdates = await NewsAndUpdates.findAll();

  let newsArray = [];
  let EventAndExamArray = [];
  let updateArray = [];

  allNewsUpdates.forEach((newsUpdate) => {
    switch (newsUpdate.post_Type) {
      case "news":
        newsArray.push(newsUpdate);
        break;
      case "event":
      case "exam":
        EventAndExamArray.push(newsUpdate);
        break;
      case "update":
        updateArray.push(newsUpdate);
        break;
      default:
        break;
    }
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { newsArray, EventAndExamArray, updateArray },
        "Arrays fetched successfully"
      )
    );
});

const deleteNewsUpdate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const newsUpdate = await NewsAndUpdates.findByPk(id);
  if (!newsUpdate) {
    throw new ApiError(404, "News update not found");
  }

  const imagePath = newsUpdate.image;
  if (imagePath) {
    const fullPath = path.join(
      __dirname,
      "..",
      "uploads",
      "newsandupdate",
      path.basename(imagePath)
    );
    try {
      await unlinkAsync(fullPath);
      console.log("Image file deleted successfully:", fullPath);
    } catch (err) {
      console.error("Error deleting image file:", err);
    }
  }

  await NewsAndUpdates.destroy({ where: { id } });

  res
    .status(200)
    .json(new ApiResponse(200, {}, "News update deleted successfully"));
});


const updateNews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, posted_By, post_Type, event_Date, event_Time } =
    req.body;
  const image = req.file;
  const newsUpdate = await NewsAndUpdates.findByPk(id);
  if (!newsUpdate) {
    throw new ApiError(404, "News update not found");
  }
  const oldImagePath = newsUpdate.image;
  if (title) newsUpdate.title = title;
  if (description) newsUpdate.description = description;
  if (posted_By) newsUpdate.posted_By = posted_By;
  if (post_Type) newsUpdate.post_Type = post_Type;
  if (event_Date) newsUpdate.event_Date = event_Date;
  if (event_Time) newsUpdate.event_Time = event_Time;
  if (image) newsUpdate.image = `/uploads/newsandupdate/${image.filename}`;
  await newsUpdate.save();
  // Delete the old image file if a new image is provided
  if (image && oldImagePath) {
    const fullOldImagePath = path.join(
      __dirname,
      "..",
      "uploads",
      "newsandupdate",
      path.basename(oldImagePath)
    );
    try {
      await unlinkAsync(fullOldImagePath);
      console.log("Old image file deleted successfully:", fullOldImagePath);
    } catch (err) {
      console.error("Error deleting old image file:", err);
    }
  }
  const updatedNews = await NewsAndUpdates.findOne({
    where: { id: newsUpdate.id },
  });
  if (!updatedNews) {
    throw new ApiError(404, "Failed to retrieve updated news data");
  }
  res
    .status(200)
    .json(new ApiResponse(200, { updatedNews }, "News updated successfully"));
});

const getNews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const newsUpdate = await NewsAndUpdates.findByPk(id);

  if (!newsUpdate) {
    throw new ApiError(404, "News update not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { newsUpdate }, "News fetched successfully"));
});

export {
  createNewsUpdate,
  updateNews,
  getAllArrays,
  deleteNewsUpdate,
  getNews,
};
