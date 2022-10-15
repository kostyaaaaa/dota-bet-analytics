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

  const radiantWinRate = currentRadiantHeroes.reduce((acc, hero) => {
    return (+hero.heroStats.winrate || 0) + acc;
  }, 0);

  const direWinRate = currentDireHeroes.reduce((acc, hero) => {
    return (+hero.heroStats.winrate || 0) + acc;
  }, 0);

  const radiantHerosPopular = currentRadiantHeroes.reduce((acc, hero) => {
    return 100 / hero.heroStats.heroIndex + acc;
  }, 0);

  const direHerosPopular = currentDireHeroes.reduce((acc, hero) => {
    return 100 / hero.heroStats.heroIndex + acc;
  }, 0);

  const radiantStats = +radiantWinRate * 0.8 + radiantHerosPopular * 0.2;
  const direStats = +direWinRate * 0.8 + direHerosPopular * 0.2;

  return {
    team_name_radiant,
    team_name_dire,
    radiant_score,
    dire_score,
    currentRadiantHeroes,
    currentDireHeroes,
    radiantStats,
    direStats,
  };
};

module.exports = getDotaMatchAnalytics;
