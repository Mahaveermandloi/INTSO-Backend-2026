import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { db } from "./db/db.config.js";
import { connectDB } from "./db/admindb.js";

const PORT = process.env.PORT || 8000;

/* =====================================================
                START SERVER
===================================================== */

const startServer = async () => {
  try {
    // ✅ Connect Databases
    await db.sequelize.sync();
    await connectDB();

    console.log("✅ Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`
=========================================
🚀 INTSO BACKEND STARTED
=========================================
✅ Server running on port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || "development"}
🔗 URL: http://localhost:${PORT}
❤️ Health: http://localhost:${PORT}/health
=========================================
      `);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
