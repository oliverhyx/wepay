//#region import
const {
  setConfig,
  resetConfig,
  getConfig
} = require('./config');
const Base = require('./class/Base');
const JSApiV3 = require('./class/JSApi/v3');
//#endregion

module.exports = {
  Base,
  setConfig,
  resetConfig,
  getConfig,
  JSApiV3
};