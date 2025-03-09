var express = require('express');
var ParseDashboard = require('parse-dashboard');
var cors = require('cors');
var fs = require('fs');

// You might need this. Use 'true' or 'false' depending your connection.
var options = { allowInsecureHTTP: true };

var apiport = 4000;
var dashboard_port = 4001;

var cert_options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
};

var trustProxy = true;
var dashboard = new ParseDashboard({
  "apps": [{
    "serverURL": 'https://localhost:' + apiport + '/api',
    "appId": 'wallboardapi',
    "masterKey": 'wallboardapi',
    "appName": 'wallboardapi',
    "production": true
  }],
  "trustProxy": 1,
  "users": [
    {
      "user": "user",
      "pass": "1234"
    },
    {
      "user": "user2",
      "pass": "1234"
    },
  ]
}, options);

var dashApp = express();

dashApp.use(cors());
dashApp.use(cors({ origin: '*' }))

// make the Parse Dashboard available at /dashboard
dashApp.use('/', dashboard);

var httpServerDash = require('https').createServer(cert_options, dashApp);

httpServerDash.listen(dashboard_port, function () {
  console.log('Parse-dashboard server running on port ' + dashboard_port + '.');
});


