var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var Config = require('../config');

//Employer Schema for DB
var company = new Schema({
  companyId : {type: String , trim : true , required : true, unique : true },  
  companyName: { type: String, trim: true, required: true },
  companyLogo: { type: String, trim: true, required: true },
  location: { type: String, trim: true, required: true},
  companyIndustry: {type : String, trim : true , required : true},
  companyDescription : { type : String , trim : true , required : true},

});

module.exports = mongoose.model('company', company);