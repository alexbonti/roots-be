/**
 * Created by Navit
 */
'use strict'

var DemoBaseRoute = require('./demoRoute/demoBaseRoute');
var UserBaseRoute = require('./userRoute/userBaseRoute');
var DemoBaseRouteTest = require('./demoRoute/demoBaseRouteTest');
var JobRoute = require('./demoRoute/jobRoute');
var APIs = [].concat(DemoBaseRoute, UserBaseRoute, DemoBaseRouteTest, JobRoute);
module.exports = APIs;