/**
 * Created by Navit
 */

'use strict';

var mongo = {
  //URI: process.env.MONGO_URI || 'mongodb://localhost/refugees',
  URI: process.env.MONGO_URI || "mongodb://"+process.env.MONGO_USER+":"+process.env.MONGO_PASS+"@964a5691-9470-487d-ad40-d27a6d1f7a24-0.22868e325a8b40b6840ed9895f3bb023.databases.appdomain.cloud:30947,964a5691-9470-487d-ad40-d27a6d1f7a24-1.22868e325a8b40b6840ed9895f3bb023.databases.appdomain.cloud:30947/roots-be-prod?authSource=admin&replicaSet=replset",
  port: 27017
};

module.exports = {
  mongo: mongo
};