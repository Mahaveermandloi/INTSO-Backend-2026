import { db } from "../db/db.config.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { convert } from "html-to-text";

const Banner = db.bannerData;
const NewsAndUpdate = db.newsAndupdateData;
const BlogList = db.blogData;
const GallaryList = db.gallaryData;
const Testimonial = db.testimonialData;

const stripHtml = (html) => {
  return convert(html, {
    wordwrap: 130,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
    ],
  });
};

const getHomeScreenData = asyncHandler(async (req, res) => {
  const bannerData = await Banner.findAll({
    limit: 3,
    order: [["createdAt", "DESC"]],
  });
  const testiMonialData = await Testimonial.findAll({
    limit: 3,
    order: [["createdAt", "DESC"]],
  });

  const blogDataRaw = await BlogList.findAll({
    limit: 3,
    order: [["createdAt", "DESC"]],
  });

  const blogData = blogDataRaw.map((blog) => {
    const plainTextDescription = stripHtml(blog.description || "");
    return {
      ...blog.toJSON(),
      description:
        plainTextDescription.substring(0, 50) +
        (plainTextDescription.length > 50 ? "..." : ""),
    };
  });

  const galleryData = await GallaryList.findAll({
    order: [["createdAt", "DESC"]],
    limit: 9,
  });

  const allNewsUpdates = await NewsAndUpdate.findAll();
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

  newsArray = newsArray.slice(0, 4);
  EventAndExamArray = EventAndExamArray.slice(0, 4);
  updateArray = updateArray.slice(0, 4);

  const news_update = { newsArray, EventAndExamArray, updateArray };

  const homedata = {
    bannerData,
    blogData,
    news_update,
    galleryData,
    testiMonialData,
  };

  res
    .status(200)
    .json(new ApiResponse(200, { homedata }, "Home data fetched successfully"));
});

export { getHomeScreenData };
