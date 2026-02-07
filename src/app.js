import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://intso-frontend-2026-s2xi.vercel.app"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true);
    }else{
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

 

// Serve static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));




// Routes
import schoolRouter from "./routes/school.routes.js";
import homeRouter from "./routes/home.routes.js";
import ResorceRouter from "./routes/resource.routes.js";
import ContactUsRouter from "./routes/contactUs.routes.js";
import BlogsRouter from "./routes/blog.routes.js";
import GallaryRouter from "./routes/gallary.routes.js";
import BannerRouter from "./routes/banner.routes.js";
import studentRequestRouter from "./routes/studentRequest.routes.js";
import studentListRouter from "./routes/studentList.routes.js";
import testimonialRouter from "./routes/testimonial.routes.js";
import adminRouter from "./routes/admin.routes.js";
import forgetPasswordRouter from "./routes/forgetpassword.routes.js";
import newsAndUpdateRouter from "./routes/newandupdate.routes.js";
import fetchExcelRouter from "./routes/fetchExcelDetails.routes.js";
import userRouter from "./routes/user.routes.js";
import newsLetterRouter from "./routes/newsLetter.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

// Route registration
app.use("/api/v1/school", schoolRouter);
app.use("/api/v1/home", homeRouter);
app.use("/api/v1/banner", BannerRouter);
app.use("/api/v1/resource", ResorceRouter);
app.use("/api/v1/contact", ContactUsRouter);
app.use("/api/v1/blogs", BlogsRouter);
app.use("/api/v1/gallery", GallaryRouter);

app.use("/api/v1/student", studentRequestRouter);

app.use("/api/v1/newsandupdates", newsAndUpdateRouter);
app.use("/api/v1/studentList", studentListRouter);
app.use("/api/v1/testiMonial", testimonialRouter);
app.use("/api/v1/fetchExcelDetail", fetchExcelRouter);
app.use("/api/v1/newsLetter", newsLetterRouter);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use("/", adminRouter);
app.use("/", forgetPasswordRouter);
app.use("/" , adminRouter);


export { app };
