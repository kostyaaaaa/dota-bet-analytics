const axios = require("axios");

const BASE_URL = process.env.DOTA_API_URL;

const instance = axios.create({
  baseURL: BASE_URL,
});

module.exports = instance;
