const axios = require("./config");
const Logger = require("../services/loggerService");

exports.getPlayerHero = async (accountId, heroId) => {
  try {
    const result = await axios.get(`/players/${accountId}/heroes`);
    const playerHeroes = result.data;
    const heroIndex =
      playerHeroes.findIndex((h) => +h.hero_id === +heroId) + 1 || 0;
    const hero = playerHeroes.find((h) => +h.hero_id === +heroId);
    const winrate = ((hero.win / hero.games) * 100).toFixed(2);
    return { ...hero, heroIndex, winrate };
  } catch (err) {
    Logger.error(`getPlayerHero, ${err.message}`);
  }
};

exports.getPlayerById = async (accountId) => {
  try {
    const result = await axios.get(`/players/${accountId}`);
    return result.data;
  } catch (err) {
    Logger.error(`getPlayerById, ${err.message}`);
  }
};
