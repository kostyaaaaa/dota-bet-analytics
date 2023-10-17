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
    const multiplier = 0.95;
    const allMatches = await Match.countDocuments({ winTeam: { $ne: "" } });
    const predictedCorrectlyMatches = await Match.countDocuments({
      $or: [
        {
          $and: [
            { winTeam: { $ne: "" } },
            {
              $expr: {
                $gt: [
                  { $multiply: ["$radiantStats", multiplier] },
                  "$direStats",
                ],
              },
            },
            { $expr: { $eq: ["$winTeam", "$radiantTeamName"] } },
          ],
        },
        {
          $and: [
            { winTeam: { $ne: "" } },
            {
              $expr: {
                $gt: [
                  { $multiply: ["$direStats", multiplier] },
                  "$radiantStats",
                ],
              },
            },
            { $expr: { $eq: ["$winTeam", "$direTeamName"] } },
          ],
        },
      ],
    });
    const predictedIncorrectlyMatches = await Match.countDocuments({
      $or: [
        {
          $and: [
            { winTeam: { $ne: "" } },
            {
              $expr: {
                $gt: [
                  { $multiply: ["$radiantStats", multiplier] },
                  "$direStats",
                ],
              },
            },
            { $expr: { $eq: ["$winTeam", "$direTeamName"] } },
          ],
        },
        {
          $and: [
            { winTeam: { $ne: "" } },
            {
              $expr: {
                $gt: [
                  { $multiply: ["$direStats", multiplier] },
                  "$radiantStats",
                ],
              },
            },
            { $expr: { $eq: ["$winTeam", "$radiantTeamName"] } },
          ],
        },
      ],
    });
    Logger.stats(
      `Total: ${allMatches}, ${predictedCorrectlyMatches}/${
        predictedIncorrectlyMatches + predictedCorrectlyMatches
      }, ${
        (
          predictedCorrectlyMatches /
          (predictedIncorrectlyMatches + predictedCorrectlyMatches)
        ).toFixed(2) * 100
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
