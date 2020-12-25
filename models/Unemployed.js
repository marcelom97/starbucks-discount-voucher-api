const { strikethrough } = require('colors');
const mongoose = require('mongoose');

const UnemployedSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    unique: [true, 'User has already applied for discount voucher'],
  },
  fathersName: {
    type: String,
    required: [true, "Please provide a valid father's name"],
  },
  afm: {
    type: Number,
    required: [true, 'Please provide a valid afm'],
  },
  amka: {
    type: Number,
    required: [true, 'Please provide a valid amka'],
  },
  unemploymentNumber: {
    type: Number,
    required: [true, 'Please provide a valid unemployment number'],
  },
  unemploymentDuaDate: {
    type: Number,
    required: [true, 'Please provide a valid unemployment due date'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = new mongoose.model('Unemployed', UnemployedSchema);
