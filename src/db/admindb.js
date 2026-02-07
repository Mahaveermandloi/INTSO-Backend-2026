// import { Sequelize } from "sequelize";
// import dotenv from "dotenv";

// dotenv.config();

/*
OLD MYSQL CONFIG (commented, not deleted)

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
  }
);
*/






// // ✅ NEW — USE COMPLETE DATABASE URL
// const sequelize = new Sequelize(process.env.DB_URL, {
//   dialect: "mysql", // change to mysql if URL is mysql
//   protocol: "mysql",
//   logging: false,

//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false, // required for Render & most cloud DBs
//     },
//   },
// });

// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//   }
// };

// export { sequelize, connectDB };

















import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // defaultdb
  process.env.DB_USERNAME,  // avnadmin
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,

    dialectOptions: {
      ssl: {
        rejectUnauthorized: false, // VERY IMPORTANT for Aiven
      },
    },
  }
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

