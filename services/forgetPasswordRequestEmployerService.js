/**
 * Created by Navit on 23/01/2016 AD.
 */
var Models = require('../models');

var getForgetPasswordRequest = function (conditions, projection, options, callback) {
  Models.ForgetPasswordRequestsEmployer.find(conditions, projection, options, callback);
};
var updateForgetPasswordRequest = function (criteria, dataToSet, options, callback) {
  Models.ForgetPasswordRequestsEmployer.findOneAndUpdate(criteria, dataToSet, options, callback);

};

var createForgetPasswordRequest = function (data, callback) {
  var forgotPasswordEntry = new Models.ForgetPasswordRequestsEmployer(data);
  forgotPasswordEntry.save(function (err, result) {
    callback(err, result);
  })
}
module.exports = {
  getForgetPasswordRequest: getForgetPasswordRequest,
  updateForgetPasswordRequest: updateForgetPasswordRequest,
  createForgetPasswordRequest: createForgetPasswordRequest
}