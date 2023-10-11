const mongoose = require("mongoose");
const Logger = require("./services/loggerService");

const { DB_HOST, DB_PASSWORD, DB_USER } = process.env;

async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority`,
    );
    Logger.log("mongodb connected successfully");
  } catch (error) {
    Logger.error("mongoose connection error: ", error.message);
  }
}

connect();
