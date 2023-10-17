const dotenv = require("dotenv");
const cron = require("node-cron");
dotenv.config();
require("./connectDB");

const { getLiveMatches } = require("./api/matches");
const getDotaMatchAnalytics = require("./utils/getDotaMatchAnalytics");
const ReportService = require("./services/ReportService");
const Logger = require("./services/loggerService");
const matchesService = require("./services/matchesService");

const doHeartBeat = async () => {
  try {
    const matches = await getLiveMatches();
    const analysedMatches = await matchesService.getAllMatches();
    const liveProMatches = matches.filter((match) => {
      return match.league_id;
    });
    if (liveProMatches.length) {
      await Promise.all(
        liveProMatches.map(async (match) => {
          const foundedMatch = analysedMatches.find(
            (m) => m.id === match.match_id,
          );
          if (!foundedMatch) {
            Logger.log(
              `Analyse match ${match.match_id} ${match.team_name_radiant} vs ${match.team_name_dire}, ${match.game_time}`,
            );
            const matchAnalytics = await getDotaMatchAnalytics(match);
            await ReportService.sendReport(matchAnalytics);
            await matchesService.createMatch({
              id: match.match_id,
              radiantTeamName: match.team_name_radiant,
              direTeamName: match.team_name_dire,
              radiantStats: matchAnalytics.radiantStats,
              direStats: matchAnalytics.direStats,
            });
          }
        }),
      );
    }
  } catch (err) {
    Logger.error(`Global Error catcher ${err.message}`);
  }
};

cron.schedule(
  "* * * * *", // every minute
  doHeartBeat,
);
