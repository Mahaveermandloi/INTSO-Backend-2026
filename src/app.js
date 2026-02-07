import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =====================================================
                    ⭐ CORS
===================================================== */





app.get("/", (req, res) => {
  res.status(200).send(`
    <h2>🚀 INTSO Backend Server is Running!</h2>
    <p>Status: ✅ Healthy</p>
  `);
});






app.use(
  cors({
    origin: true, // reflects request origin
    credentials: true,
  })
);


/* =====================================================
                ⭐ MIDDLEWARE
===================================================== */

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* =====================================================
                ⭐ STATIC FILES
===================================================== */

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =====================================================
                ⭐ ROOT ROUTE
===================================================== */

app.get("/", (req, res) => {
  res.status(200).send(`
      <h2>🚀 INTSO Admin Backend is Running!</h2>
      <p>Status: ✅ Healthy</p>
      <p>Environment: ${process.env.NODE_ENV || "development"}</p>
    `);
});


/* =====================================================
                ⭐ HEALTH CHECK
===================================================== */

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

/* =====================================================
                    ⭐ ROUTES
===================================================== */

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
app.use("/api/v1/testimonial", testimonialRouter);
app.use("/api/v1/fetchExcelDetail", fetchExcelRouter);
app.use("/api/v1/newsLetter", newsLetterRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// Admin routes
app.use("/", adminRouter);
app.use("/", forgetPasswordRouter);

/* =====================================================
                ⭐ 404 HANDLER
===================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =====================================================
            ⭐ GLOBAL ERROR HANDLER
===================================================== */

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

/* =====================================================
                ⭐ START SERVER
===================================================== */
