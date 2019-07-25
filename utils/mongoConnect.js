/**
 * Created by Navit
 */

'use strict';
var Mongoose = require('mongoose');
var Config = require('../config');



//Connect to MongoDB
Mongoose.connect(Config.DBCONFIG.mongo.URI, { useNewUrlParser: true }, function (err) {
  if (err) {
    console.log("DB Error: ", err);
    process.exit(1);
  } else {
    console.log('MongoDB Connected');
  }
});

exports.Mongoose = Mongoose;


