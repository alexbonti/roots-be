/**
 * Created by Navit
 */

"use strict";
//External Dependencies
require("dotenv");
var Hapi = require("hapi");
const https = require('https')

//Internal Dependencies
var Config = require("./config");
var Plugins = require("./plugins");
var SocketManager = require("./lib/socketManager");
var Routes = require("./routes");

//Mongo connection
var MongoConnect = require("./utils/mongoConnect");

var Path = require("path");
global.appRoot = Path.resolve(__dirname);

const init = async () => {
  //Create Server
  var server = new Hapi.Server({
    app: {
      name: process.env.APP_NAME
    },
    port: process.env.HAPI_PORT,
    routes: { cors: true }
  });

  //Register All Plugins
  await server.register(Plugins, {}, err => {
    if (err) {
      server.log(["error"], "Error while loading plugins : " + err);
    } else {
      server.log(["info"], "Plugins Loaded");
    }
  });

  //add views
  await server.views({
    engines: {
      html: require("handlebars")
    },
    relativeTo: __dirname,
    path: "./views"
  });

  //Default Routes
  server.route({
    method: "GET",
    path: "/",
    handler: function (req, res) {
      return res.view("welcome");
    }
  });

  server.route({
    method: "*",
    path: "/helper/imageProxy",
    handler: function (req, res) {
      if (typeof req.query.url === 'undefined' && typeof req.query.responseType === 'undefined') {
        return 'Cannot process this request';
      }

      if (req.query.responseType) {
        let url = req.query.url;

        return new Promise(function (resolve, reject) {
          const options = new URL(url);

          const reqHttps = https.request(options, (response) => {
            console.log(`statusCode: ${response.statusCode}`)
          })

          reqHttps.on('response', function (d) {
            resolve(res.response(d).type('image/png'));
          });

          reqHttps.on('error', (error) => {
            console.error(error);
            reject(error);
          })

          reqHttps.end()
        });

      } else {
        return 'Cannot process this request.';
      }
    }
  });

  server.route(Routes);

  SocketManager.connectSocket(server);

  server.events.on("response", function (request) {
    console.log(
      request.info.remoteAddress +
      ": " +
      request.method.toUpperCase() +
      " " +
      request.url.pathname +
      " --> " +
      request.response.statusCode
    );
    console.log("Request payload:", request.payload);
  });

  // Start Server
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

init();
