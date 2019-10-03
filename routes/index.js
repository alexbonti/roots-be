/**
 * Created by Navit
 */
"use strict";

var DemoBaseRoute = require("./demoRoute/demoBaseRoute");
var UserBaseRoute = require("./userRoute/userBaseRoute");
var DemoBaseRouteTest = require("./demoRoute/demoBaseRouteTest");
var JobRoute = require("./opportunityRoute/jobRoute");
var JobsAppliedRoute = require("./jobsAppliedRoute/jobsAppliedRoute");
var EmployerBaseRoute = require("./employerRoute/employerBaseRoute");
var UploadBaseRoute = require("./uploadRoute/uploadBaseRoute");
var APIs = [].concat(
  DemoBaseRoute,
  UserBaseRoute,
  EmployerBaseRoute,
  DemoBaseRouteTest,
  JobRoute,
  JobsAppliedRoute,
  UploadBaseRoute
);
module.exports = APIs;
