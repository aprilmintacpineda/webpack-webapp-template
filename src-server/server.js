'use strict';

require('dotenv').config();

const path = require('path');
const uuidv4 = require('uuid/v4');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const compression = require('compression');

const app = express();
app.use(compression());
app.use(helmet());
app.use(session({
  secret: uuidv4(),
  name: 'session',
  saveUninitialized: false,
  resave: false,
  rolling: true,
  cookie: {
    secure: true,
    httpOnly: true,
    domain: process.env.DOMAIN,
    path: '/',
    expires: new Date(Date.now() + 3600000)
  }
}));

app.use('/api/test', (req, res) => {
  setTimeout(() => {
    res.send({
      test: 'value'
    });
  }, 500);
});

app.use(express.static(path.join(__dirname, 'static/')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

app.listen(process.env.PORT);
