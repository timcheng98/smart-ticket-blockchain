const http = require('http');
const moment = require('moment');
const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
// require("body-parser-xml")(bodyParser);
// const useragent = require('express-useragent');
const consolidate = require("consolidate");
const morgan = require('morgan');
const helmet = require('helmet');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const Strategy = require('passport-http').BasicStrategy;
const CustomStrategy = require('passport-custom').Strategy;
const config = require('config');
const WebSocket = require('ws');
const cors = require('cors');
// const websocketController = require('./websocket-controller');

const debug = require('debug')('app:web-server');

// passport.serializeUser(function(userData, done) {
//   console.log(`serializeUser() :: userData >> `, userData);
//   done(null, userData);
// });

// passport.deserializeUser(async function(userData, done) {
//   console.log(`deserializeUser() :: userData >> `, userData);
//   done(null, userData);
// });

// passport.use(new Strategy(
//   function(username, password, cb) {
//     if (config.get('AUTH.PASSWORD') !== null
//         && config.get('AUTH.USERNAME') === username
//         && config.get('AUTH.PASSWORD') === password) {
//       return cb(null, {
//         admin_id: 1
//       });
//     }
//     return cb(null, false);
//   }
// ));

// exports.setAuthentication = (strategyName, authFunc) => {
//   passport.use(strategyName, new CustomStrategy(
//     authFunc
//   ));
// };

exports.createServer = function (_opts) {
  const opts = _opts || {};

  let {
    viewsPath, staticPath, router, port, sessionSecret
  } = opts;
  let mountPoint = opts.mount || '/';
  let mysqlConfig = opts.mysql || {};

  if (!sessionSecret || sessionSecret.length === 0) {
    console.warn(`WebServer :: missing {sessionSecret}, generating temporary {sessionSecret}, for development only`);
    sessionSecret = Math.random().toString();
  }

  let app = express();

  app.use(helmet());

  app.use(cookieParser());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  // app.use(bodyParser.xml());
  // app.use(useragent.express());

  app.engine("mustache", consolidate.hogan);
  app.set("view engine", "mustache");
  // app.set('trust proxy', ['loopback', '127.0.0.1']); // for Nginx proxy
  app.set('trust proxy');

  morgan.token('date', function() {
    // return new Date().toISOString();
    return moment().format();
  });
  // app.use(morgan('combined'));
  app.use(morgan('common'));

  app.use(cors());

  if (viewsPath) {
    app.set("views", viewsPath);
  }

  if (staticPath) {
    if (Array.isArray(staticPath)) {
      // using Array as static path
      staticPath.forEach(function(p) {
        app.use(mountPoint, express.static(p));
      });
    } else {
      // using String as static path
      app.use(mountPoint, express.static(staticPath));
    }
  }

  app.use(/^\/js|^\/css|^\/font[s]?|^\/webfont[s]?|\/img|favicon.ico/i, (req, res) => {
    res.sendStatus(404);
  });

  let useMySQLStore = mysqlConfig.host && mysqlConfig.password && mysqlConfig.user && mysqlConfig.database;

  if (useMySQLStore) {
    // using MySQL Session Store
    app.use(session({
      store: new MySQLStore(mysqlConfig),
      secret: sessionSecret,
      resave: true,
      saveUninitialized: true
    }));
  } else {
    // using Memory Session Store
    console.warn(`WebServer :: using memory session store, for development only`);
    app.use(session({
      secret: sessionSecret,
      resave: true,
      saveUninitialized: true
    }));
  }

  app.use(passport.initialize());
  app.use(passport.session());

  if (router) {
    app.use(mountPoint, router);
  }

  app.use(function (req, res) {
    res.sendStatus(404);
  });

  app.use(function (err, req, res, next) {
    console.error(err.stack);
    next();
  });

  app.use(function(req, res) {
    res.sendStatus(500);
  });

  const server = http.createServer(app);

  const wss = new WebSocket.Server({ noServer: true });

  server.on('upgrade', async function (request, socket, head) {
    debug('on upgrade :: Parsing session from request...');

    // debug(`request.headers >> `, request.headers);

    const {
      token: access_token,
    } = request.headers;

    debug(`access_token >> `, access_token);
    debug(`session >> `, request.session);

    debug(`request.url `, request.url);

    // const controllerSession = await websocketController.authorize(access_token);

    // if (!controllerSession) {
    //   socket.destroy();
    //   return;
    // }

    // wss.handleUpgrade(request, socket, head, function (ws) {
    //   ws.session = controllerSession;
    //   websocketController.registerConnection(controllerSession, ws);
    //   wss.emit('connection', ws, request);
    // });
  });

  wss.on('connection', function (ws, request) {
    debug(`onConnection :: session >> `, ws.session);

    // const userId = request.session.userId;

    // map.set(userId, ws);

    // ws.send('hello world!!');

    // websocketController.sendCommandToController(ws.session.access_token, {
    //   action: 'acknowlege',
    // });

    ws.on('message', function (message) {
      //
      // Here we can now use session parameters.
      //
      console.log(`ws Received message ${message}`);
    });

    ws.on('close', function () {
      console.log(`ws connection close`);
      // websocketController.unregisterConnection(ws.session);
    });

    ws.on('error', (err) => {
      console.error(err);
      // websocketController.unregisterConnection(ws.session);
    });
  });

  server.listen(port, function() {
    console.info("listening on port %s!", port);
  });

  return app;
};
