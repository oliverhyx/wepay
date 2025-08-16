//#region import
const {
  setConfig,
  resetConfig,
  getConfig
} = require('./config');
const Base = require('./class/Base');
const JSApiV3 = require('./class/JSApi/v3');
const NativeV3 = require('./class/Native/v3');
//#endregion

module.exports = {
  Base,
  setConfig,
  resetConfig,
  getConfig,
  JSApiV3,
  NativeV3
};