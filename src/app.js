import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ROUTES
import schoolRouter from "./routes/school.routes.js";
import homeRouter from "./routes/home.routes.js";
import resourceRouter from "./routes/resource.routes.js";
import contactUsRouter from "./routes/contactUs.routes.js";
import blogsRouter from "./routes/blog.routes.js";
import galleryRouter from "./routes/gallary.routes.js";
import bannerRouter from "./routes/banner.routes.js";
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

/* =====================================================
                PATH FIX (ES MODULE)
===================================================== */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =====================================================
                GLOBAL MIDDLEWARE
===================================================== */

// ✅ CORS (Production Friendly)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Body Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* =====================================================
                STATIC FILES
===================================================== */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "public")));

/* =====================================================
                HEALTH + ROOT
===================================================== */

// ⭐ ROOT URL
app.get("/", (req, res) => {
  res.status(200).send(`
    <div style="font-family:sans-serif;text-align:center;margin-top:40px;">
      <h1>🚀 INTSO Backend is Running Successfully</h1>
      <p>Status: ✅ Healthy</p>
      <p>Environment: ${process.env.NODE_ENV || "development"}</p>
      <p>Time: ${new Date().toLocaleString()}</p>
    </div>
  `);
});

// ⭐ HEALTH CHECK (Used by AWS, Render, Docker etc.)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

/* =====================================================
                    API ROUTES
===================================================== */

// ✅ Versioned Routes (BEST PRACTICE)
app.use("/api/v1/school", schoolRouter);
app.use("/api/v1/home", homeRouter);
app.use("/api/v1/banner", bannerRouter);
app.use("/api/v1/resource", resourceRouter);
app.use("/api/v1/contact", contactUsRouter);
app.use("/api/v1/blogs", blogsRouter);
app.use("/api/v1/gallery", galleryRouter);
app.use("/api/v1/student", studentRequestRouter);
app.use("/api/v1/newsandupdates", newsAndUpdateRouter);
app.use("/api/v1/studentList", studentListRouter);
app.use("/api/v1/testimonial", testimonialRouter);
app.use("/api/v1/fetchExcelDetail", fetchExcelRouter);
app.use("/api/v1/newsLetter", newsLetterRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// ⭐ ADMIN (Move under v1 — much cleaner)
app.use("/", adminRouter);
app.use("/", forgetPasswordRouter);

/* =====================================================
                404 HANDLER
===================================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route Not Found: ${req.originalUrl}`,
  });
});

/* =====================================================
            GLOBAL ERROR HANDLER
===================================================== */

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
