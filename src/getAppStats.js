const dotenv = require("dotenv");
dotenv.config();
require("./connectDB");
const mongoose = require("mongoose");

const matchesService = require("./services/matchesService");

matchesService.getAppStats();

mongoose.connection.close();
