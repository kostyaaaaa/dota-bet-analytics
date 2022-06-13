const dotenv = require("dotenv");
dotenv.config();

const { getLiveMatches } = require("./api/matches");
const heroesWasChanged = require("./utils/heroesWasChanged");
const getDotaMatchAnalytics = require("./utils/getDotaMatchAnalytics");
const ReportService = require("./services/ReportService");
const Logger = require("./services/loggerService");

const analysedMatches = {};

const doHeartBeat = async () => {
  try {
    const matches = await getLiveMatches();
    const liveProMatches = matches.filter((match) => {
      return match.league_id;
    });
    if (liveProMatches.length) {
      await Promise.all(
        liveProMatches.map(async (match) => {
          const foundedMatch = analysedMatches[match.match_id];
          if (
            !foundedMatch ||
            heroesWasChanged(
              match.match_id,
              foundedMatch.players,
              match.players
            )
          ) {
            analysedMatches[match.match_id] = {
              players: match.players,
            };
            Logger.log(
              `Analyse match ${match.match_id} ${match.team_name_radiant} vs ${match.team_name_dire}, ${match.game_time}`
            );
            const matchAnalytics = await getDotaMatchAnalytics(match);
            await ReportService.sendReport(matchAnalytics);
          }
        })
      );
    }
  } catch (err) {
    Logger.error(`Global Error catcher ${err.message}`);
  }
};

doHeartBeat();
setInterval(() => doHeartBeat(), 60000);
