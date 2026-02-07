import dotenv from "dotenv";
import express from "express";
dotenv.config();

const PORT = process.env.PORT;
const app = express()
const startServer = async () => {
  try {
    app.listen(PORT, () => {
        console.log(process.env);
      console.log(`Server is running at port : ${PORT}`);
    });
  } catch (error) {
    console.log("Error in index.js: ", error);
  }
};

startServer();
