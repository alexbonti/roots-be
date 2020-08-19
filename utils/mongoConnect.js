/**
 * Created by Navit
 */

'use strict';
var Mongoose = require('mongoose');
var Config = require('../config');
var fs = require('fs');

var path = require('path');
var appDir = path.dirname(require.main.filename);

var ca = [fs.readFileSync(`${appDir}/certs/certificate.crt`)];

//Connect to MongoDB
Mongoose.set('useCreateIndex', true);
Mongoose.set('useFindAndModify', false);
Mongoose.connect(Config.DBCONFIG.mongo.URI, { useNewUrlParser: true,mongos: {ssl: true,sslValidate: false,sslCA:ca} }, function (err) {
  if (err) {
    console.log("DB Error: ", err);
    process.exit(1);
  } else {
    console.log('MongoDB Connected');
  }
});

exports.Mongoose = Mongoose;


