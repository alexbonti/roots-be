var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//DB schema for opportunity
var opportunity = new Schema({
  employerId: { type: Schema.ObjectId, ref: "employer" },  
  company: { type: String, trim: true, required: true },
  position: { type: String, trim: true, required: true },
  publishDate: { type: Date, default: Date.now },
  jobType: { type: String, trim: true, required: true },
  location: { type: String, trim: true, required: true },
  content: { type: String, trim: true, required: true },
  active: {type : Boolean, default: true}
});

module.exports = mongoose.model('opportunity', opportunity);