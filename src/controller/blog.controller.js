

import { db } from "../db/db.config.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { convert } from "html-to-text";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const unlinkAsync = promisify(fs.unlink);
const BlogList = db.blogData;
const stripHtml = (html) => {
  return convert(html, {
    wordwrap: 130,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
    ],
  });
};
// ------------------------------------------------------------------------
const PostBlogData = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    posted_By,
    meta_title,
    meta_description,
    permalink,
  } = req.body;
  const blog_image = req.file;
  if (!title || !description || !posted_By || !permalink) {
    throw new ApiError(400, "Bad Data");
  }
  let imagePath = "";
  if (blog_image) {
    imagePath = `/uploads/blog/${blog_image.filename}`;
  }
  const transformPermalink = (permalink) => {
    return permalink
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .trim() // Remove leading and trailing spaces
      .replace(/\s+/g, "-"); // Replace spaces with hyphens
  };
  const permalinkData = transformPermalink(permalink);
  const blogObject = {
    image: imagePath,
    title,
    description,
    posted_By,
    meta_title,
    meta_description,
    permalink: permalinkData,
  };
  const data = await BlogList.create(blogObject);
  res
    .status(200)
    .json(new ApiResponse(200, { data }, "Data sent successfully"));
});
// ------------------------------------------------------------------------
const trimDescription = (description, wordLimit) => {
  const words = description.split(/\s+/);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : description;
};
const getBlogDetails = asyncHandler(async (req, res) => {
  const { permalink } = req.params;
  if (!permalink) {
    throw new ApiError(403, "Blog ID is required");
  }
  const blog = await BlogList.findOne({ where: { permalink } });
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  const recentBlogs = await BlogList.findAll({
    where: {
      permalink: {
        [Op.ne]: permalink,
      },
    },
    order: [["createdAt", "DESC"]],
    limit: 3,
  });
  // const blogData = {
  //   ...blog.toJSON(),
  //   description: trimDescription(stripHtml(blog.description || ""), 10),
  // };
  const recentBlogData = recentBlogs.map((recentBlog) => ({
    ...recentBlog.toJSON(),
    description: trimDescription(stripHtml(recentBlog.description || ""), 10),
  }));
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { blog, recentBlogs: recentBlogData },
        "Blog sent successfully"
      )
    );
});
// ------------------------------------------------------------------------
const getAllBlogDetails = asyncHandler(async (req, res) => {
  const blogs = await BlogList.findAll({
    order: [["createdAt", "DESC"]],
  });
  if (!blogs.length) {
    throw new ApiError(404, "No blogs found");
  }
  const blogData = blogs.map((blog) => {
    const plainTextDescription = stripHtml(blog.description || "");
    return {
      ...blog.toJSON(),
      description:
        plainTextDescription.substring(0, 150) +
        (plainTextDescription.length > 150 ? "..." : ""),
    };
  });
  res
    .status(200)
    .json(new ApiResponse(200, { blogData }, "Blogs sent successfully"));
});
// -------------------------------------------EDIT---------------------------
const editBlogDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(403, "Blog ID is required");
  }
  const blog = await BlogList.findByPk(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  const plainTextDescription = stripHtml(blog.description || "");
  const blogData = {
    ...blog.toJSON(),
    description: plainTextDescription,
  };
  res
    .status(200)
    .json(new ApiResponse(200, { blogData }, "Blog sent successfully"));
});
// --------------------------UPDATE----------------------------------
// const updateBlogDetails = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   const { title, description, permalink, posted_By } = req.body;
//   const image = req.file;
//   let imagePath = "";
//   if (image) {
//     imagePath = `/uploads/blog/${image.filename}`;
//   }
//   const blog = await BlogList.findByPk(id);
//   if (!blog) {
//     throw new ApiError(404, "Blog not found");
//   }
//   if (title) blog.title = title.toLowerCase();
//   if (description) blog.description = description.toLowerCase();
//   if (permalink) blog.permalink = permalink.toLowerCase();
//   if (posted_By) blog.posted_By = posted_By.toLowerCase();
//   if (imagePath) blog.image = imagePath;
//   await blog.save();
//   const updatedBlog = await BlogList.findOne({
//     where: { id: blog.id },
//   });
//   if (!updatedBlog) {
//     throw new ApiError(404, "Failed to retrieve updated blog data");
//   }
//   res
//     .status(200)
//     .json(new ApiResponse(200, updatedBlog, "Blog updated successfully"));
// });
const updateBlogDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, permalink, posted_By } = req.body;
  const image = req.file;
  let newImagePath = "";
  if (image) {
    newImagePath = `/uploads/blog/${image.filename}`;
  }
  const blog = await BlogList.findByPk(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  const oldImagePath = blog.image;
  if (title) blog.title = title.toLowerCase();
  if (description) blog.description = description.toLowerCase();
  if (permalink) blog.permalink = permalink.toLowerCase();
  if (posted_By) blog.posted_By = posted_By.toLowerCase();
  if (newImagePath) blog.image = newImagePath;
  await blog.save();
  // Delete the old image file if a new image is provided
  if (newImagePath && oldImagePath) {
    const fullOldImagePath = path.join(
      __dirname,
      "..",
      "uploads",
      "blog",
      path.basename(oldImagePath)
    );
    try {
      await unlinkAsync(fullOldImagePath);
    } catch (err) {
      console.error("Error deleting old image file:", err);
    }
  }
  const updatedBlog = await BlogList.findOne({
    where: { id: blog.id },
  });
  if (!updatedBlog) {
    throw new ApiError(404, "Failed to retrieve updated blog data");
  }
  res
    .status(200)
    .json(new ApiResponse(200, updatedBlog, "Blog updated successfully"));
});
// ----------------------------------------------------------------------
const deleteBlogs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(403, "Blog ID is required");
  }
  const blog = await BlogList.findByPk(id);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  const imagePath = blog.image;
  if (imagePath) {
    const fullPath = path.join(
      __dirname,
      "..",
      "uploads",
      "blog",
      path.basename(imagePath)
    );
    try {
      await unlinkAsync(fullPath);
    } catch (err) {
      console.error("Error deleting image file:", err);
    }
  }
  const isDeleted = await BlogList.destroy({
    where: {
      id: id,
    },
  });
  if (!isDeleted) {
    throw new ApiError(500, "Facing some issue deleting this blog");
  }
  res.status(200).json(new ApiResponse(200, {}, "Blog deleted successfully"));
});
export {
  PostBlogData,
  getAllBlogDetails,
  getBlogDetails,
  editBlogDetails,
  deleteBlogs,
  updateBlogDetails,
};
