const { getPlayerHero, getPlayerById } = require("../api/players");
const ALL_HEROES = require("../constants/heroes");

const getDotaMatchAnalytics = async (match) => {
  const {
    team_id_radiant,
    team_id_dire,
    team_name_radiant,
    team_name_dire,
    radiant_score,
    dire_score,
    players,
  } = match;

  const currentRadiantPlayers = players.filter(
    (player) => player.team_id === team_id_radiant
  );
  const currentDirePlayers = players.filter(
    (player) => player.team_id === team_id_dire
  );

  const currentRadiantHeroes = await Promise.all(
    currentRadiantPlayers.map(async (player) => {
      const heroName = ALL_HEROES.find(
        (h) => h.id === player.hero_id
      ).localized_name;
      const heroStats = await getPlayerHero(player.account_id, player.hero_id);
      const playerStats = await getPlayerById(player.account_id);

      return `${heroName} Rank: ${playerStats.leaderboard_rank} MMR: ${
        playerStats.solo_competitive_rank
      } Popular: ${heroStats.heroIndex} Games: ${heroStats.games} Winrate: ${(
        (heroStats.win / heroStats.games) *
        100
      ).toFixed(2)}%`;
    })
  );

  const currentDireHeroes = await Promise.all(
    currentDirePlayers.map(async (player) => {
      const heroName = ALL_HEROES.find(
        (h) => h.id === player.hero_id
      ).localized_name;
      const heroStats = await getPlayerHero(player.account_id, player.hero_id);
      const playerStats = await getPlayerById(player.account_id);

      return `${heroName} Rank: ${playerStats.leaderboard_rank} MMR: ${
        playerStats.solo_competitive_rank
      } Popular: ${heroStats.heroIndex} Games: ${heroStats.games} Winrate: ${(
        (heroStats.win / heroStats.games) *
        100
      ).toFixed(2)}%`;
    })
  );

  return `${team_name_radiant} vs ${team_name_dire}, Score: ${radiant_score}:${dire_score} Radiant: ${JSON.stringify(
    currentRadiantHeroes
  )} Dire: ${JSON.stringify(currentDireHeroes)}`;
};

module.exports = getDotaMatchAnalytics;
