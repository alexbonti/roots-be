/**
 * Created by Navit
 */
'use strict'

var DemoBaseRoute = require('./demoRoute/demoBaseRoute');
var UserBaseRoute = require('./userRoute/userBaseRoute');
var DemoBaseRouteTest = require('./demoRoute/demoBaseRouteTest');
var JobRoute = require('./demoRoute/jobRoute');
var EmployerBaseRoute = require('./employerRoute/employerBaseRoute');
var APIs = [].concat(DemoBaseRoute, UserBaseRoute, EmployerBaseRoute, DemoBaseRouteTest, JobRoute);
module.exports = APIs;