const dotenv = require("dotenv");
dotenv.config();
require("../connectDB");
const mongoose = require("mongoose");

const matchesService = require("../services/matchesService");

mongoose.connection.on("open", async () => {
  await matchesService.updateAllMatches();
  mongoose.connection.close();
});
