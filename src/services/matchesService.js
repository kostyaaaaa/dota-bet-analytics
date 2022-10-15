const Match = require("../models/matchesModel");
const Logger = require("./loggerService");

const createMatch = async (data) => {
  try {
    const match = new Match(data);

    await match.save();
  } catch (err) {
    Logger.error(`createMatch, ${err.message}`);
  }
};

const updateMatchById = async (data) => {
  try {
    const { winTeam, id } = data;
    await Match.findByIdAndUpdate(id, { winTeam });
  } catch (err) {
    Logger.error(`updateMatchById, ${err.message}`);
  }
};

const getAllMatches = async () => {
  try {
    const allMatches = await Match.find({});
    return allMatches;
  } catch (err) {
    Logger.error(`getAllMatches, ${err.message}`);
  }
};

module.exports = {
  createMatch,
  updateMatchById,
  getAllMatches,
};
