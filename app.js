const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const { red } = require('colors');
const connectDB = require('./config/connectDB');
const errorHandler = require('./middlewares/errorHandler');
const userRouter = require('./routes/userRouter');

dotenv.config({ path: './config/config.env' });

const app = (module.exports = express());

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/ping', (req, res, next) => {
  res.status(200).json({
    message: 'pong',
  });
});

app.use('/api/v1/users', userRouter);

app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(red(`Error: ${err.message}`));
});
