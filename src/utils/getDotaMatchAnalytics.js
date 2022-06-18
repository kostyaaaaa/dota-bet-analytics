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

      return { heroName, playerStats, heroStats };
    })
  );

  const currentDireHeroes = await Promise.all(
    currentDirePlayers.map(async (player) => {
      const heroName = ALL_HEROES.find(
        (h) => h.id === player.hero_id
      ).localized_name;
      const heroStats = await getPlayerHero(player.account_id, player.hero_id);
      const playerStats = await getPlayerById(player.account_id);

      return { heroName, playerStats, heroStats };
    })
  );

  return {
    team_name_radiant,
    team_name_dire,
    radiant_score,
    dire_score,
    currentRadiantHeroes,
    currentDireHeroes,
  };
};

module.exports = getDotaMatchAnalytics;
