const axios = require("./config");
const Logger = require("../services/loggerService");

exports.getLiveMatches = async () => {
  try {
    const result = await axios.get(`/live`);
    return result.data;
  } catch (err) {
    Logger.error(`getLiveMatches, ${err.message}`);
  }
};

exports.getMatchById = async (matchId) => {
  try {
    const result = await axios.get(`/matches/${matchId}`);
    return result.data;
  } catch (err) {
    Logger.error(`getMatchById, ${err.message}`);
  }
};
