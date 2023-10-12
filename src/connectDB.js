const mongoose = require("mongoose");
const Logger = require("./services/loggerService");

const { DB_HOST, DB_PASSWORD, DB_USER, DB_NAME } = process.env;

async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
    );
    Logger.log("mongodb connected successfully");
  } catch (error) {
    Logger.error("mongoose connection error: ", error.message);
  }
}

connect();
