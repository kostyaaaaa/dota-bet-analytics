const Logger = require("../services/loggerService");

module.exports = (matchId, players, players2) => {
  const heroes = players.map((player) => player.hero_id);
  const heroes2 = players2.map((player) => player.hero_id);

  heroes.sort((a, b) => a - b);
  heroes2.sort((a, b) => a - b);

  const isHeroesEqual = JSON.stringify(heroes) === JSON.stringify(heroes2);

  if (!isHeroesEqual) {
    Logger.log(`Heroes was changed for ${matchId}`);
  }

  return !isHeroesEqual;
};
