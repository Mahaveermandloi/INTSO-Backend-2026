import { db } from "../db/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const schoolList = db.schoolData;
const studentList = db.studentListData;

const approveSchool = asyncHandler(async (req, res) => {
  const { school_id } = req.params;

  // Find the school by ID
  const school = await schoolList.findByPk(school_id);

  if (!school) {
    throw new ApiError(404, "School not found");
  }

  // Update the status to approved
  school.status = "approved";
  await school.save();

  res
    .status(200)
    .json(new ApiResponse(200, { school }, "School approved successfully"));
});

const rejectSchool = asyncHandler(async (req, res) => {
  const { school_id } = req.params;

  // Find the school by ID
  const school = await schoolList.findByPk(school_id);

  if (!school) {
    throw new ApiError(404, "School not found");
  }

  // Update the status to rejected
  school.status = "rejected";
  await school.save();

  res
    .status(200)
    .json(new ApiResponse(200, { school }, "School rejected successfully"));
});

const deleteSchoolRequest = asyncHandler(async (req, res) => {
  const { school_id } = req.params;

  // Find the school by ID
  const school = await schoolList.findByPk(school_id);

  if (!school) {
    throw new ApiError(404, "School not found");
  }

  await studentList.destroy({
    where: {
      school_id: school_id,
    },
  });

  const isDeleted = await schoolList.destroy({
    where: {
      school_id: school_id,
    },
  });

  if (!isDeleted) {
    throw new ApiError(500, "Facing some issue deleting this school request");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "School request deleted successfully"));
});

const addToSchoolList = asyncHandler(async (req, res) => {
  const { school_id } = req.params;

  // Find the school by ID
  const school = await schoolList.findByPk(school_id);

  if (!school) {
    throw new ApiError(404, "School not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { school }, "School found successfully"));
});

export { approveSchool, rejectSchool, deleteSchoolRequest, addToSchoolList };
