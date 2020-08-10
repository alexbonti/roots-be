/**
 * Created by Navit on 15/11/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var Config = require('../config');

var user = new Schema({
  first_name: { type: String, trim: true, required: true },
  last_name: { type: String, trim: true, required: true },
  emailId: { type: String, trim: true, required: true, unique: true },
  accessToken: { type: String, trim: true, index: true, unique: true, sparse: true },
  linkedinId: { type: String, trim: true },
  password: { type: String },
  code: { type: String, trim: true },
  OTPCode: { type: String, trim: true },
  emailVerified: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
  userProfileSetupComplete: { type: Boolean, default: false },
  codeUpdatedAt: { type: Date, default: Date.now, required: true },
  firstLogin: { type: Boolean, default: true }
});

module.exports = mongoose.model('user', user);