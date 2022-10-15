const dotenv = require("dotenv");
dotenv.config();
require("./connectDB");

const matchesService = require("./services/matchesService");

matchesService.getAppStats();
