const hapi = require("@hapi/hapi");
let express = require("express");
const AuthBearer = require("hapi-auth-bearer-token");
let fs = require("fs");
let cors = require("cors");

const OnlineAgent = require("./repository/OnlineAgent");

const apiconfig = require("./apiconfig")["production"];

//-------------------------------------

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const apiport = 8443;

var url = require("url");

//---------------- Websocket Part1 Start -----------------------

var webSocketServer = new (require("ws").Server)({
    port: process.env.PORT || 3071,
  }),
  clientWebSockets = {}; // userID: webSocket
CLIENTS = [];

webSocketServer.on("connection", (ws, req) => {
  var q = url.parse(req.url, true);

  console.log(q.host);
  console.log(q.pathname);
  console.log(q.search);

  var qdata = q.query; //returns an object: { year: 2017, month: 'february' }

  console.log("------- webSocketServer ------");
  console.log("AgentCode: " + qdata.agentcode);
  ws.agentcode = qdata.agentcode;

  // clientWebSockets[ws.agentcode] = ws;
  ws.name = ws.agentcode;
  //CLIENTS.push(ws.agentcode);

  var newItem = ws.agentcode;

  if (CLIENTS.indexOf(newItem) === -1) {
    clientWebSockets[ws.agentcode] = ws;
    CLIENTS.push(newItem);
    ws.send("NEW USER JOINED");
    console.log("New agent joined");
  } else {
    //ws.send("USER ALREADY JOINED");
    console.log("This agent already joined");

    //-----------------
    const index = CLIENTS.indexOf(newItem);
    if (index > -1) {
      CLIENTS.splice(index, 1);
    }

    //console.log(CLIENTS);

    delete clientWebSockets[ws.agentcode];
    console.log("Previous Agent deleted: " + ws.agentcode);
    //---------------------
    clientWebSockets[ws.agentcode] = ws;

    CLIENTS.push(newItem);
    ws.send("NEW USER JOINED");
    console.log("New agent joined");
    //--------------------
  }

  //console.log('ws.agentcode : ' + newItem)
  console.dir("CLIENTS : " + CLIENTS);

  ws.on("close", function () {
    const index = CLIENTS.indexOf(newItem);
    if (index > -1) {
      CLIENTS.splice(index, 1);
    }

    //console.log(CLIENTS);

    delete clientWebSockets[ws.agentcode];
    console.log("Agent deleted: " + ws.agentcode);
  });
});

//---------------- Websocket Part1 End -----------------------

//init Express
var app = express();
//init Express Router
var router = express.Router();
//var port = process.env.PORT || 87;

//REST route for GET /status
router.get("/status", function (req, res) {
  res.json({
    status: "App is running!",
  });
});

//connect path to router
app.use("/", router);

//----------------------------------------------

const init = async () => {
  //process.setMaxListeners(0);
  require("events").defaultMaxListeners = 0;
  process.setMaxListeners(0);

  var fs = require("fs");

  var tls = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.crt"),
  };

  //const server = Hapi.Server({
  const server = hapi.Server({
    port: apiport,
    host: "0.0.0.0",
    tls: tls,
    //routes: {
    //    cors: true
    //}
    routes: {
      cors: {
        origin: ["*"],
        headers: [
          "Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin",
          "Accept",
          "Authorization",
          "Content-Type",
          "If-None-Match",
          "Accept-language",
        ],
        additionalHeaders: [
          "Access-Control-Allow-Headers: Origin, Content-Type, x-ms-request-id , Authorization",
        ],
        credentials: true,
      },
    },
  });

  await server.register(require("@hapi/inert"));

  await server.register(AuthBearer);

  server.auth.strategy("simple", "bearer-access-token", {
    allowQueryToken: true, // optional, false by default
    validate: async (request, token, h) => {
      // here is where you validate your token
      // comparing with token from your database for example
      const isValid = token === apiconfig.serverKey;

      const credentials = { token };
      const artifacts = { test: "info" };

      return { isValid, credentials, artifacts };
    },
  });

  server.auth.default("simple");

  //-- Route ------

  server.route({
    method: "GET",
    path: "/",
    config: {
      cors: {
        origin: ["*"],
        headers: [
          "Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin",
          "Accept",
          "Authorization",
          "Content-Type",
          "If-None-Match",
          "Accept-language",
        ],
        additionalHeaders: [
          "Access-Control-Allow-Headers: Origin, Content-Type, x-ms-request-id , Authorization",
        ],
        credentials: true,
      },
    },
    handler: async (request, h) => {
      try {
        //console.log('CORS request.info:');
        //console.log(request.info.cors);
        return "Test Hello, from Endpoint Web Report API.";
      } catch (err) {
        console.dir(err);
      }
    },
  });

  //-------- Code continue here -------------------

  server.route({
    method: "GET",
    path: "/api/v1/getOnlineAgentByAgentCode",
    config: {
      cors: {
        origin: ["*"],
        headers: [
          "Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin",
          "Accept",
          "Authorization",
          "Content-Type",
          "If-None-Match",
          "Accept-language",
        ],
        additionalHeaders: [
          "Access-Control-Allow-Headers: Origin, Content-Type, x-ms-request-id , Authorization",
        ],
        credentials: true,
      },
    },
    handler: async (request, h) => {
      let param = request.query;

      //console.log(param);
      //console.log("Level: "+param.level);

      try {
        if (param.agentcode == null)
          //return h.response("Please provide agentcode.").code(400);
          return h
            .response({
              error: true,
              statusCode: 400,
              errMessage: "Please provide agentcode.",
            })
            .code(400);
        else {
          const responsedata =
            await OnlineAgent.OnlineAgentRepo.getOnlineAgentByAgentCode(
              `${param.agentcode}`
            );

          if (responsedata.statusCode == 500)
            return h
              .response({
                error: true,
                statusCode: 500,
                errMessage: "An internal server error occurred.",
              })
              .code(500);
          else if (responsedata.statusCode == 200) return responsedata;
          else if (responsedata.statusCode == 404)
            return h.response(responsedata).code(404);
          else
            return h
              .response("Something went wrong. Please try again later.")
              .code(500);
        }
      } catch (err) {
        console.dir(err);
      }
    },
  });

  server.route({
    method: "POST",
    path: "/api/v1/postOnlineAgentStatus",
    config: {
      cors: {
        origin: ["*"],
        headers: [
          "Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin",
          "Accept",
          "Authorization",
          "Content-Type",
          "If-None-Match",
          "Accept-language",
        ],
        additionalHeaders: [
          "Access-Control-Allow-Headers: Origin, Content-Type, x-ms-request-id , Authorization",
        ],
        credentials: true,
      },
      payload: {
        parse: true,
        allow: ["application/json", "multipart/form-data"],
        multipart: true, // <== this is important in hapi 19
      },
    },
    handler: async (request, h) => {
      let param = request.payload;

      const AgentCode = param.AgentCode;
      const AgentName = param.AgentName;
      const IsLogin = param.IsLogin;
      const AgentStatus = param.AgentStatus;
      var d = new Date();

      try {
        if (param.AgentCode == null)
          //return h.response("Please provide agentcode.").code(400);

          return h
            .response({
              error: true,
              statusCode: 400,
              errMessage: "Please provide agentcode.",
            })
            .code(400);
        else {
          const responsedata =
            await OnlineAgent.OnlineAgentRepo.postOnlineAgentStatus(
              AgentCode,
              AgentName,
              IsLogin,
              AgentStatus
            );

          //---------------- Websocket Part2 Start -----------------------
          console.log("AgentCode: " + AgentCode);

          if (!responsedata.error) {
            if (clientWebSockets[AgentCode]) {
              console.log("Sennding MessageType");

              clientWebSockets[AgentCode].send(
                JSON.stringify({
                  MessageType: "1",
                  AgentCode: AgentCode,
                  AgentName: AgentName,
                  IsLogin: IsLogin,
                  AgentStatus: AgentStatus,
                  DateTime: d.toLocaleString("en-US"),
                })
              );

              return {
                error: false,
                message: "Agent status has been set.",
              };
            }
          }
          //---------------- Websocket Part2 End -----------------------

          if (responsedata.statusCode == 200) return responsedata;
          else if (responsedata.statusCode == 404)
            return h.response(responsedata).code(404);
          else
            return h
              .response("Something went wrong. Please try again later.")
              .code(500);
        }
      } catch (err) {
        console.dir(err);
      }
    },
  });

  server.route({
    method: "POST",
    path: "/api/v1/postSendMessage",
    config: {
      cors: {
        origin: ["*"],
        headers: [
          "Access-Control-Allow-Headers",
          "Access-Control-Allow-Origin",
          "Accept",
          "Authorization",
          "Content-Type",
          "If-None-Match",
          "Accept-language",
        ],
        additionalHeaders: [
          "Access-Control-Allow-Headers: Origin, Content-Type, x-ms-request-id , Authorization",
        ],
        credentials: true,
      },
      payload: {
        parse: true,
        allow: ["application/json", "multipart/form-data"],
        multipart: true, // <== this is important in hapi 19
      },
    },
    handler: async (request, h) => {
      let param = request.payload;

      const FromAgentCode = param.FromAgentCode;
      const ToAgentCode = param.ToAgentCode;
      const Message = param.Message;
      var d = new Date();

      try {
        if (param.FromAgentCode == null || param.ToAgentCode == null)
          return h.response("Please provide AgentCode.").code(400);
        else {
          //---------------- Websocket -----------------------------

          if (clientWebSockets[ToAgentCode]) {
            clientWebSockets[ToAgentCode].send(
              JSON.stringify({
                MessageType: "2",
                FromAgentCode: FromAgentCode,
                ToAgentCode: ToAgentCode,
                DateTime: d.toLocaleString("en-US"),
                Message: Message,
              })
            );

            return {
              error: false,
              message: "Message has been set.",
            };
          } else
            return h
              .response("Agent not found, can not send message to agent.")
              .code(404);

          //---------------- Websocket -----------------------------
        }
      } catch (err) {
        console.dir(err);
      }
    },
  });

  //----------------------------------------------

  await server.start();
  console.log("Webreport API Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
