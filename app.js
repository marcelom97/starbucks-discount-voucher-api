const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { red } = require('colors');
const path = require('path');
const connectDB = require('./config/connectDB');
const errorHandler = require('./middlewares/errorHandler');

const userRouter = require('./routes/userRouter');
const unemployedRouter = require('./routes/unemployedRouter');
const authRouter = require('./routes/authRouter');
const voucherRouter = require('./routes/voucherRouter');

dotenv.config({ path: './config/config.env' });

const app = express();

connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/unemployed', unemployedRouter);
app.use('/api/v1/voucher', voucherRouter);

app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(red(`Error: ${err.message}`));
});

module.exports = app;
