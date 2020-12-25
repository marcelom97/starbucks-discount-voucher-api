const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a valid username'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide a valid email'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a valid password'],
    minlength: 6,
    select: false,
  },
  firstname: {
    type: String,
    required: [true, 'Please provide a valid first name'],
  },
  lastname: {
    type: String,
    required: [true, 'Please provide a valid last name'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please provide a valid date of birth'],
    match: [/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/, 'Please provide a valid date of birth'],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Encrypt Password using bcrypt
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  /* eslint-disable-next-line */
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Sign refresh token and return
UserSchema.methods.getRefreshToken = function () {
  /* eslint-disable-next-line */
  return jwt.sign({ id: this._id }, process.env.REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_EXPIRE,
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  /* eslint-disable-next-line */
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set Expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 100;

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
