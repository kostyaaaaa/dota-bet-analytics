const axios = require("./config");
const Logger = require("../services/loggerService");

exports.getTeamMatches = async (id) => {
  try {
    const result = await axios.get(`/teams/${id}/matches`);
    return result.data;
  } catch (err) {
    Logger.error(`getTeamMatches, ${err.message}`);
  }
};

exports.getTeamHeroes = async (id) => {
  try {
    const result = await axios.get(`/teams/${id}/heroes`);
    return result.data;
  } catch (err) {
    Logger.error(`getTeamHeroes, ${err.message}`);
  }
};
