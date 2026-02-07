import dotenv from "dotenv";
import { db } from "./db/db.config.js";
import { app } from "./app.js";
import { connectDB } from "./db/admindb.js";

dotenv.config();

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await db.sequelize.sync();
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running at port : ${PORT}`);
    });
  } catch (error) {
    console.log("Error in index.js: ", error);
  }
};

startServer();
