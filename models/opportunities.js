var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var opportunities = new Schema({
  employerId: { type: String, trim: true, required: true, unique: true },  
  company: { type: String, trim: true, required: true },
  position: { type: String, trim: true, required: true },
  publishDate: { type: Date, default: Date.now },
  jobType: { type: String, trim: true, required: true },
  location: { type: String, trim: true, required: true },
  content: { type: String, trim: true, required: true },
  active: {type : Boolean, default: true}
});

module.exports = mongoose.model('opportunities', opportunities);