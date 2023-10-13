const Match = require("../models/matchesModel");
const Logger = require("./loggerService");
const { getMatchById } = require("../api/matches");

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

const updateAllMatches = async () => {
  try {
    const allMatches = await Match.find({});
    const matchesWithoutWinner = allMatches.filter((m) => !m.winTeam);
    await Promise.all(
      matchesWithoutWinner.map(async (m) => {
        const match = await getMatchById(m.id);
        if (match.radiant_win !== undefined) {
          await updateMatchById({
            id: m._id,
            winTeam: match.radiant_win ? m.radiantTeamName : m.direTeamName,
          });
        }
      }),
    );
  } catch (err) {
    Logger.error(`updateAllMatches, ${err.message}`);
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

const getAppStats = async () => {
  try {
    const allMatches = await Match.countDocuments({ winTeam: { $ne: "" } });
    const predictedCorrectlyMatches = await Match.countDocuments({
      $or: [
        {
          $and: [
            { winTeam: { $ne: "" } },
            { $expr: { $gt: ["$radiantStats", "$direStats"] } },
            { $expr: { $eq: ["$winTeam", "$radiantTeamName"] } },
          ],
        },
        {
          $and: [
            { $expr: { $gt: ["$direStats", "$radiantStats"] } },
            { winTeam: { $ne: "" } },
            { $expr: { $eq: ["$winTeam", "$direTeamName"] } },
          ],
        },
      ],
    });
    Logger.stats(
      `${predictedCorrectlyMatches}/${allMatches}, ${
        (predictedCorrectlyMatches / allMatches).toFixed(2) * 100
      }%`,
    );
  } catch (err) {
    Logger.error(`getAppStats, ${err.message}`);
  }
};

module.exports = {
  createMatch,
  updateMatchById,
  updateAllMatches,
  getAllMatches,
  getAppStats,
};
