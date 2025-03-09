const express = require("express");
const ParseServer = require("parse-server").ParseServer;
const path = require("path");
const cron = require("node-cron");
const mongoose = require("mongoose");
var cors = require("cors");
var fs = require("fs");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

var apiport = 4000;

var options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.crt"),
};

const config = {
  databaseURI: "mongodb://wallboarduser:WB1qazxsw2@localhost:27017/wallboarddb",
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + "/cloud/main.js",
  appId: process.env.APP_ID || "wallboardapi",
  masterKey: process.env.MASTER_KEY || "wallboardapi", //Add your master key here. Keep it secret!
  clientKey: "wallboardapi",
  javascriptKey: "wallboardapi",
  serverURL: "https://localhost:" + apiport + "/api", // Don't forget to change to https if needed
  publicServerURL: "https://localhost:" + apiport + "/api",
  liveQuery: {
    classNames: ["OnlineAgentLists", "WallboardBanners", "CallAgentSummaries"], // List of classes to support for query subscriptions
  },

  masterKeyIps: ["0.0.0.0/0", "::/0"],
  useMasterKey: true,
  allowClientClassCreation: false,
  allowExpiredAuthDataToken: false,
  // encodeParseObjectInCloudFunction: false
};

const app = express();

app.use(cors());
app.use(cors({ origin: "*" }));

// Serve static assets from the /public folder
app.use("/", express.static(path.join(__dirname, "/wallboard")));

// Serve the Parse API on the /parse URL prefix
const mountPath = "/api";
const api = new ParseServer(config);

// 3. Start up Parse Server asynchronously
api.start();

app.use(mountPath, api.app);

var httpsServer = require("https").createServer(options, app);

httpsServer.listen(apiport, function () {
  console.log("3CX Wallboard API (htts) running on port " + apiport + ".");
});

ParseServer.createLiveQueryServer(httpsServer);
