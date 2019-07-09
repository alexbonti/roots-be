/**
 * Created by Navit
 */
'use strict'

var DemoBaseRoute = require('./demoRoute/demoBaseRoute');
var UserBaseRoute = require('./userRoute/userBaseRoute');
var DemoBaseRouteTest = require('./demoRoute/demoBaseRouteTest')
var APIs = [].concat(DemoBaseRoute, UserBaseRoute, DemoBaseRouteTest);
module.exports = APIs;