import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // defaultdb
  process.env.DB_USERNAME, // avnadmin
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: true,

    dialectOptions: {
      ssl: {
        rejectUnauthorized: false, // VERY IMPORTANT for Aiven
      },
    },
  },
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

export { sequelize, connectDB };
