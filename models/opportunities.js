var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//DB schema for opportunity
var opportunity = new Schema({
  employerId: { type: Schema.ObjectId, ref: "employer" },
  company: { type: String, trim: true, required: true },
  positionTitle: { type: String, trim: true, required: true },
  employmentType: { type: String, trim: true, required: true },
  skills: [{ type: String, trim: true, required: true }],
  seniority: { type: String, trim: true, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: null },
  publishDate: { type: Date, default: Date.now },
  industryField: { type: String, trim: true, required: true },
  description: { type: String, trim: true, required: true },
  location: { type: String, trim: true, required: true },
  active: { type: Boolean, default: true },
  shortListed: [{ type: Schema.ObjectId, ref: "user" }]
});

module.exports = mongoose.model('opportunity', opportunity);