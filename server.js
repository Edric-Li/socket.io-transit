import path from 'path';
import http from 'http';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import PrettyError from 'pretty-error';
import config from 'config';
import cors from 'cors';

import Start from './socket-io/main';

process.on('SIGTERM', () => {
  setTimeout(() => {
    process.exit();
  }, 1000);
});

const app = express();
const server = http.Server(app);
//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

app.set('view engine', 'ejs');

if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: true,
    credentials: true,
  }));
} else if (config.cors) {
  app.use(cors(config.cors));
}

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
express.static.mime.define({ 'application/octet-stream': ['log'] });
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));


const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

server.listen(config.port, '0.0.0.0', () => {
  console.log(`The server is running at http://localhost:${config.get('transit.port')}/`);
});

Start(server, config.get('transit.namespaces').split(','));
