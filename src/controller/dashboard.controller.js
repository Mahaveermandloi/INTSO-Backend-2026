import { db } from "../db/db.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const ResourceList = db.resourcesData;
const School = db.schoolData;
const StudentList = db.studentListData;

const getStats = asyncHandler(async (req, res) => {
  const no_of_student = await StudentList.findAll();

  console.log(no_of_student);

  const no_of_school_requests = await School.findAll();
  console.log(no_of_school_requests);

  const no_of_approved_school = await School.findAll({
    where: { status: "approved" },
  });
  console.log(no_of_approved_school);

  const free_content = await ResourceList.findAll({
    where: { is_paid: false },
  });

  console.log(free_content);

  const paid_content = await ResourceList.findAll({
    where: { is_paid: true },
  });

  console.log(paid_content);
  
  const stats = [
    { no_of_school_requests: no_of_school_requests.length },
    { no_of_approved_school: no_of_approved_school.length },
    { free_content: free_content.length },
    { paid_content: paid_content.length },
    { no_of_student: no_of_student.length },
  ];

  console.log(stats);

  res
    .status(200)
    .json(new ApiResponse(200, { stats }, "data sent successfully"));
});

export { getStats };
