import { db } from "../db/db.config.js"; // Assuming your model file is named Resource
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unlinkAsync = promisify(fs.unlink);

const ResourceList = db.resourcesData;
const createResource = asyncHandler(async (req, res) => {
  const {
    title,
    resource_type,
    is_paid,
    description,
    resource_url,
    resource_class,
  } = req.body;
  const uploaded_by = req.admin.name;

  if (
    !title ||
    !resource_type ||
    !description ||
    !resource_url ||
    !resource_class
  ) {
    throw new ApiError(400, "Bad Data");
  }

  let resource_urlPath = "";
  let thumbnailPath = "";

  // Handle different resource types
  if (
    resource_type === "image" &&
    req.files &&
    req.files.image &&
    req.files.image[0]
  ) {
    resource_urlPath = `/uploads/resources/images/${req.files.image[0].filename}`;
  } else if (
    resource_type === "pdf" &&
    req.files &&
    req.files.pdf &&
    req.files.pdf[0]
  ) {
    resource_urlPath = `/uploads/resources/pdfs/${req.files.pdf[0].filename}`;
  } else if (
    resource_type === "video" &&
    req.files &&
    req.files.thumbnail &&
    req.files.thumbnail[0]
  ) {
    resource_urlPath = resource_url;
    thumbnailPath = `/uploads/resources/videos/${req.files.thumbnail[0].filename}`;
  } else {
    throw new ApiError(400, "Invalid resource type or no file uploaded.");
  }

  const newResource = await ResourceList.create({
    title,
    resource_type,
    is_paid: is_paid || false,
    description,
    resource_class,
    uploaded_by,
    resource_url: resource_urlPath,
    thumbnail: thumbnailPath,
  });

  res
    .status(200)
    .json(new ApiResponse(200, newResource, "Resource created successfully"));
});

const getAllResourcesByAdmin = asyncHandler(async (req, res) => {
  try {
    const { searchTerm, resource_class } = req.query;

    let whereClause = {};
    if (searchTerm) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }
    if (resource_class) {
      whereClause = { ...whereClause, resource_class };
    }

    const resourcesData = await ResourceList.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: 3,
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { resourcesData },
          "Resource data sent successfully"
        )
      );
  } catch (error) {
    console.error("Error fetching resources:", error);
    res
      .status(500)
      .json(
        new ApiResponse(500, null, "An error occurred while fetching resources")
      );
  }
});

const getAllDataByAdmin = asyncHandler(async (req, res) => {
  const resourcesData = await ResourceList.findAll({});
  res
    .status(200)
    .json(
      new ApiResponse(200, { resourcesData }, "Resource data sent successfully")
    );
});

// -----------------------------------------------------------------------
const getFreeResources = asyncHandler(async (req, res) => {
  try {
    const { searchTerm, resource_class } = req.query;

    let whereClause = { is_paid: false };
    // Build the query conditionally based on the provided search term and resource class
    if (searchTerm) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }

    if (resource_class) {
      whereClause = { ...whereClause, resource_class };
    }
    const resourcesData = await ResourceList.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    let imageArray = [];
    let pdfArray = [];
    let videoArray = [];
    resourcesData.forEach((resource) => {
      switch (resource.resource_type) {
        case "image":
          imageArray.push(resource);
          break;
        case "pdf":
          pdfArray.push(resource);
          break;
        case "video":
          videoArray.push(resource);
          break;
        default:
          break;
      }
    });
    imageArray = imageArray.slice(0, 3);
    pdfArray = pdfArray.slice(0, 3);
    videoArray = videoArray.slice(0, 3);
    const resourceData = { imageArray, pdfArray, videoArray };
    res.status(200).json({
      resourceData,
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({
      message: "An error occurred while fetching resources",
      error: error.message, // Optionally include the error message for debugging
    });
  }
});

const getPaidResourcesByUser = asyncHandler(async (req, res) => {
  try {
    const { searchTerm, resource_class } = req.query;

    let whereClause = { is_paid: true };
    // Build the query conditionally based on the provided search term and resource class
    if (searchTerm) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { title: { [Op.like]: `%${searchTerm}%` } },
          { description: { [Op.like]: `%${searchTerm}%` } },
        ],
      };
    }

    if (resource_class) {
      whereClause = { ...whereClause, resource_class };
    }
    const resourcesData = await ResourceList.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    let imageArray = [];
    let pdfArray = [];
    let videoArray = [];
    resourcesData.forEach((resource) => {
      switch (resource.resource_type) {
        case "image":
          imageArray.push(resource);
          break;
        case "pdf":
          pdfArray.push(resource);
          break;
        case "video":
          videoArray.push(resource);
          break;
        default:
          break;
      }
    });
    imageArray = imageArray.slice(0, 3);
    pdfArray = pdfArray.slice(0, 3);
    videoArray = videoArray.slice(0, 3);
    const resourceData = { imageArray, pdfArray, videoArray };
    res.status(200).json({
      resourceData,
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({
      message: "An error occurred while fetching resources",
      error: error.message, // Optionally include the error message for debugging
    });
  }
});

// --------------------------------------------------------------------------------

const getAllImages = asyncHandler(async (req, res) => {
  try {
    // Fetch all image resources where resource_type is "image"
    const resourceData = await ResourceList.findAll({
      where: {
        resource_type: "image",
      },
      order: [["createdAt", "DESC"]],
    });

    // Check if resourcesData is empty
    if (!resourceData || resourceData.length === 0) {
      return res.status(404).json({
        message: "No image resources found",
      });
    }

    // Prepare the response with imageArray containing image resources

    // Send the response with imageArray
    res.status(200).json({
      resourceData,
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({
      message: "An error occurred while fetching resources",
      error: error.message, // Optionally include the error message for debugging
    });
  }
});
const getAllPdfs = asyncHandler(async (req, res) => {
  try {
    // Fetch all image resources where resource_type is "image"
    const resourceData = await ResourceList.findAll({
      where: {
        resource_type: "pdf",
      },
      order: [["createdAt", "DESC"]],
    });

    // Check if resourcesData is empty
    if (!resourceData || resourceData.length === 0) {
      return res.status(404).json({
        message: "No image resources found",
      });
    }

    // Prepare the response with imageArray containing image resources

    // Send the response with imageArray
    res.status(200).json({
      resourceData,
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({
      message: "An error occurred while fetching resources",
      error: error.message, // Optionally include the error message for debugging
    });
  }
});
const getAllVideos = asyncHandler(async (req, res) => {
  try {
    // Fetch all image resources where resource_type is "image"
    const resourceData = await ResourceList.findAll({
      where: {
        resource_type: "video",
      },
      order: [["createdAt", "DESC"]],
    });

    // Check if resourcesData is empty
    if (!resourceData || resourceData.length === 0) {
      return res.status(404).json({
        message: "No image resources found",
      });
    }

    // Prepare the response with imageArray containing image resources

    // Send the response with imageArray
    res.status(200).json({
      resourceData,
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    res.status(500).json({
      message: "An error occurred while fetching resources",
      error: error.message, // Optionally include the error message for debugging
    });
  }
});

// --------------------------------------------------------------------------------
const getPaidResources = asyncHandler(async (req, res) => {
  const paidResourcesData = await ResourceList.findAll({
    where: {
      is_paid: true,
    },
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { paidResourcesData },
        "Paid resource data sent successfully"
      )
    );
});

// --------------------------------------------------------------------------

const deleteResource = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id; // Use req.params.id to access route parameters

    if (!id) {
      throw new ApiError(403, "Resource ID is required");
    }

    const resource = await ResourceList.findByPk(id);
    if (!resource) {
      throw new ApiError(404, "Resource not found");
    }

    const resourceFilePath = resource.resource_url;
    const thumbnailPath = resource.thumbnail;

    // Define a helper function to delete files
    const deleteFile = async (filePath) => {
      if (filePath) {
        const fullPath = path.join(__dirname, "..", filePath);
     
        try {
          await unlinkAsync(fullPath);
        
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      }
    };

    // Delete resource file and thumbnail file if they exist
    await deleteFile(resourceFilePath);
    await deleteFile(thumbnailPath);

    const isDeleted = await ResourceList.destroy({
      where: {
        id: id,
      },
    });

    if (!isDeleted) {
      throw new ApiError(500, "Facing some issue deleting this resource");
    }

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Resource deleted successfully"));
  } catch (error) {
    console.error("Error deleting resource:", error);
    res.status(500).json({
      message:
        error.message || "An error occurred while deleting the resource.",
    });
  }
});

export {
  createResource,
  getFreeResources,
  deleteResource,
  getAllResourcesByAdmin,
  getAllDataByAdmin,
  getPaidResources,
  getAllImages,
  getAllVideos,
  getAllPdfs,
  getPaidResourcesByUser,
};
