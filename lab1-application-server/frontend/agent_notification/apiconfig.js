const apiconfig = {
  development: {
    endpointAPI: "https://localhost:8443/api/v1",
    endpointWS: "ws://localhost:3071",
    parseServerAPI: "https://localhost:4000/api",
    parseServerWS: "wss://localhost:4000",
    masterKey: "wallboardapi",
    clientKey: "wallboardapi",
    javascriptKey: "wallboardapi",
    appId: "wallboardapi",
  },
  production: {
    hosturl: "https://lab-parse-server.se-rmutl.net/api",
    wsurl: "wss://lab-parse-server.se-rmutl.net",
    masterKey: "wallboardapi",
    clientKey: "wallboardapi",
    javascriptKey: "wallboardapi",
    appId: "wallboardapi",
  },
};
module.exports = apiconfig;
