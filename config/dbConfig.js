/**
 * Created by Navit
 */

'use strict';

var mongo = {
  //URI: process.env.MONGO_URI || 'mongodb://localhost/refugees',
  URI: process.env.MONGO_URI || "mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@a064ca00-3e8f-4940-a0ca-18ca35c6fff9-0.22868e325a8b40b6840ed9895f3bb023.databases.appdomain.cloud:31051,a064ca00-3e8f-4940-a0ca-18ca35c6fff9-1.22868e325a8b40b6840ed9895f3bb023.databases.appdomain.cloud:31051/ibmclouddb?authSource=admin&replicaSet=replset",
  port: 27017
};

module.exports = {
  mongo: mongo
};