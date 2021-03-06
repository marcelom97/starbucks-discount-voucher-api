const mongoose = require('mongoose');

const UnemployedSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, 'Please provide a valid first name'],
  },
  lastname: {
    type: String,
    required: [true, 'Please provide a valid last name'],
  },
  birthdate: {
    type: String,
    required: [true, 'Please provide a valid birth date'],
    match: [/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/, 'Please provide a valid date of format YYYY-MM-DD'],
  },
  fathersname: {
    type: String,
    required: [true, "Please provide a valid father's name"],
  },
  adt: {
    type: String,
    required: [true, 'Please provide a valid identity card number'],
  },
  afm: {
    type: String,
    required: [true, 'Please provide a valid afm'],
    unique: [true, 'User has already applied for discount voucher'],
  },
  amka: {
    type: String,
    required: [true, 'Please provide a valid amka'],
    unique: [true, 'User has already applied for discount voucher'],
  },
  unemploymentNumber: {
    type: String,
    required: [true, 'Please provide a valid unemployment number'],
  },
  unemploymentDuaDate: {
    type: String,
    required: [true, 'Please provide a valid unemployment due date'],
    match: [/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/, 'Please provide a valid date of format YYYY-MM-DD'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  points: {
    type: Number,
    min: 0,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = new mongoose.model('Unemployed', UnemployedSchema);
