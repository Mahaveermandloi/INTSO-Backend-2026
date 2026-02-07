import { sequelize } from "./admindb.js";
import { Sequelize } from "sequelize";
import studentRequestModel from "../models/studentRequest.model.js";
import schoolModel from "../models/school.model.js";
import BannerModel from "../models/banner.model.js";
import newsAndUpdateModel from "../models/newsAndupdate.model.js";
import testimonialModel from "../models/testimonial.model.js";
import blogsModel from "../models/blogs.model.js";
import galleryModel from "../models/gallery.model.js";
import ResourcesModel from "../models/resources.model.js";
import contactUsModel from "../models/contactUs.model.js";
import studentListModel from "../models/studentList.model.js";
import newsLetterModel from "../models/newsLetter.model.js";
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models-table
db.studentrequestData = studentRequestModel(sequelize, Sequelize);
db.schoolData = schoolModel(sequelize, Sequelize);
db.bannerData = BannerModel(sequelize, Sequelize);
db.newsAndupdateData = newsAndUpdateModel(sequelize, Sequelize);
db.testimonialData = testimonialModel(sequelize, Sequelize);
db.blogData = blogsModel(sequelize, Sequelize);
db.gallaryData = galleryModel(sequelize, Sequelize);
db.resourcesData = ResourcesModel(sequelize, Sequelize);
db.contactData = contactUsModel(sequelize, Sequelize);
db.studentListData = studentListModel(sequelize, Sequelize);
db.newsLetterData = newsLetterModel(sequelize, Sequelize);

export { db };
