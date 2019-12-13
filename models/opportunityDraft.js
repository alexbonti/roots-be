var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//DB schema for opportunity
var opportunityDraft = new Schema({
  employerId: { type: Schema.ObjectId, ref: "employer" },  
  company: { type: String, trim: true, required: true },
  positionTitle: { type: String, trim: true},
  employmentType: { type: String, trim: true },
  skills : [{type: String , trim : true }],
  seniority : {type: String , trim : true},
  startDate : { type: Date, default: Date.now },
  endDate : { type: Date, default: null },
  publishDate: { type: Date, default: Date.now },
  industryField : {type: String , trim : true},
  description: { type: String, trim: true},
  location: { type: String, trim: true },
  locationCoordinates: {
    'type': { type: String, enum: "Point", default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }
  },
  active: {type : Boolean, default: true}
});
opportunityDraft.index({ locationCoordinates: '2dsphere' });
module.exports = mongoose.model('opportunityDraft', opportunityDraft);