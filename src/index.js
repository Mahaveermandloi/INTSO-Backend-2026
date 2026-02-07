import { db } from "./db/db.config.js";
import { connectDB } from "./db/admindb.js";

import express from "express";

const app = express();
const PORT = process.env.PORT || 8000;

/* =====================================================
                ⭐ START SERVER
===================================================== */

const startServer = async () => {
  try {
    await db.sequelize.sync();
    await connectDB();

    app.listen(PORT, () => {
      console.log(`
=========================================
🚀 INTSO ADMIN BACKEND STARTED
=========================================
✅ Server running on port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || "development"}
🕒 Started at: ${new Date().toLocaleString()}
🔗 Health Check: http://localhost:${PORT}/health
=========================================
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1); // stop app if DB fails
  }
};

startServer();
