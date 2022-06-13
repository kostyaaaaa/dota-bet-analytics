const { getTeamHeroes } = require("../api/teams");
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

  const allRadiantHeroes = await getTeamHeroes(team_id_radiant);
  const allDireHeroes = await getTeamHeroes(team_id_dire);

  const currentRadiantPlayers = players.filter(
    (player) => player.team_id === team_id_radiant
  );
  const currentDirePlayers = players.filter(
    (player) => player.team_id === team_id_dire
  );

  const currentRadiantHeroes = currentRadiantPlayers.map(
    (player) => player.hero_id
  );
  const currentDireHeroes = currentDirePlayers.map((player) => player.hero_id);

  const currentRadiantHeroesStats = currentRadiantHeroes.map((hero) => {
    const index = allRadiantHeroes.findIndex((h) => h.hero_id === hero) + 1;
    const heroInfo = allRadiantHeroes.find((h) => h.hero_id === hero) || {};
    const heroWinRate = (heroInfo.wins / heroInfo.games_played) * 100;
    return `popularity: ${index}, heroWinRate: ${heroInfo.wins}/${
      heroInfo.games_played
    }, heroName: ${ALL_HEROES.find((h) => h.id === hero).localized_name}---`;
  });

  const currentDireHeroesStats = currentDireHeroes.map((hero) => {
    const index = allDireHeroes.findIndex((h) => h.hero_id === hero) + 1;
    const heroInfo = allDireHeroes.find((h) => h.hero_id === hero) || {};
    return `popularity: ${index}, heroWinRate: ${heroInfo.wins}/${
      heroInfo.games_played
    }, heroName: ${ALL_HEROES.find((h) => h.id === hero).localized_name}---`;
  });

  return `${team_name_radiant} vs ${team_name_dire}, ${radiant_score}:${dire_score} Radiant: ${JSON.stringify(
    currentRadiantHeroesStats
  )} Dire: ${JSON.stringify(currentDireHeroesStats)}`;
};

module.exports = getDotaMatchAnalytics;
