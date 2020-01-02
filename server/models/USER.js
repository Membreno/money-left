const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  impact: {
    type: String
  },
  bank: {
    type: Number
  }
}, {
  timestamps: true
});

const BillSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  repeats: {
    type: Boolean,
    default: true
  },
  isPaid: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  bank: {
    type: Number,
    default: 0
  },
  transactions: [TransactionSchema],
  bills: [BillSchema]
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
const Bill = mongoose.model('Bill', BillSchema);
module.exports = User;