var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var Config = require('../config');

//Employer Schema for DB
var employer = new Schema({
  first_name: { type: String, trim: true, required: true },
  last_name: { type: String, trim: true, required: true },
  emailId: { type: String, trim: true, required: true, unique: true },
  companyId : {type: String, ref: "company", required: true, default : null},
  businessPhoneNumber : { type : Number , trim : true},
  accessToken: { type: String, trim: true, index: true, unique: true, sparse: true },
  password: { type: String },
  code: { type: String, trim: true },
  OTPCode: { type: String, trim: true },
  emailVerified: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
  codeUpdatedAt: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('employer', employer);