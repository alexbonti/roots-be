/**
 * Created by Navit
 */
var UniversalFunctions = require("../../utils/universalFunctions");
var async = require("async");
var ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;

var demoFunction = function(payloadData, callback) {
  return callback(null,payloadData);
};

module.exports = {
  demoFunction: demoFunction
};
