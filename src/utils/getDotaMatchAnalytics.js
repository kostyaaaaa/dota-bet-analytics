const { getTeamHeroes } = require("../api/teams");
const { getPlayerHero } = require("../api/players");
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

  const currentRadiantHeroes = await Promise.all(
    currentRadiantPlayers.map(async (player) => {
      const heroName = ALL_HEROES.find(
        (h) => h.id === player.hero_id
      ).localized_name;
      const playerStats = await getPlayerHero(
        player.account_id,
        player.hero_id
      );

      const teamInfo =
        allRadiantHeroes.find((h) => +h.hero_id === +player.hero_id) || {};
      const index =
        allRadiantHeroes.findIndex((h) => +h.hero_id === +player.hero_id) + 1;

      return `${heroName} Solo - Popular ${playerStats.heroIndex} Games ${
        playerStats.games
      }, ${((playerStats.win / playerStats.games) * 100).toFixed(
        2
      )}% Team - Popular ${index} Games ${teamInfo.games_played}, ${(
        (teamInfo.wins / teamInfo.games_played) *
        100
      ).toFixed(1)}%`;
    })
  );

  const currentDireHeroes = await Promise.all(
    currentDirePlayers.map(async (player) => {
      const heroName = ALL_HEROES.find(
        (h) => h.id === player.hero_id
      ).localized_name;
      const playerStats = await getPlayerHero(
        player.account_id,
        player.hero_id
      );

      const teamInfo =
        allDireHeroes.find((h) => h.hero_id === +player.hero_id) || {};
      const index =
        allDireHeroes.findIndex((h) => h.hero_id === +player.hero_id) + 1;

      return `${heroName} Solo - Popular ${playerStats.heroIndex} Games ${
        playerStats.games
      }, ${((playerStats.win / playerStats.games) * 100).toFixed(
        2
      )}% Team - Popular ${index} Games ${teamInfo.games_played}, ${(
        (teamInfo.wins / teamInfo.games_played) *
        100
      ).toFixed(1)}%`;
    })
  );

  return `${team_name_radiant} vs ${team_name_dire}, Score: ${radiant_score}:${dire_score} Radiant: ${JSON.stringify(
    currentRadiantHeroes
  )} Dire: ${JSON.stringify(currentDireHeroes)}`;
};

module.exports = getDotaMatchAnalytics;
