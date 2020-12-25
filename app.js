const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config({ path: './config/config.env' });

const app = (module.exports = express());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/ping', (req, res, next) => {
  res.status(200).json({
    message: 'pong',
  });
});

app.use(errorHandler);
