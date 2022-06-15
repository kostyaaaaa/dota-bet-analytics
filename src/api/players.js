const axios = require("./config");
const Logger = require("../services/loggerService");

exports.getPlayerHero = async (accountId, heroId) => {
  try {
    const result = await axios.get(`/players/${accountId}/heroes`);
    const playerHeroes = result.data;
    const heroIndex = playerHeroes.findIndex((h) => +h.hero_id === +heroId) + 1;
    const hero = playerHeroes.find((h) => +h.hero_id === +heroId);
    return { ...hero, heroIndex };
  } catch (err) {
    Logger.error(`getPlayerHero, ${err.message}`);
  }
};

exports.getPlayerById = async (accountId) => {
  try {
    const result = await axios.get(`/players/${accountId}`);
    return result.data;
  } catch (err) {
    Logger.error(`getPlayer, ${err.message}`);
  }
};
