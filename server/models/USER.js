const mongoose = require('mongoose'),
      crypto = require('crypto'),
      Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


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
  },
  impact: {
    type: String,
    default: 'neg'
  },
}, {
  timestamps: true
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    unique: true,
    // required: true,
  },
  // password: String,
  bank: {
    type: Number,
    default: 0
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  transactions: [TransactionSchema],
  bills: [BillSchema]
}, {timestamps: true});

// UserSchema.pre('save', function(next) {
//   if(this.password){
//     this.salt = new Buffer(
//       crypto.randomBytes(16).toString('base64'),
//       'base64'
//     );
//     this.password = crypto.pbkdf2Sync(
//       password, this.salt, 10000, 64
//     ).toString('base64');
//   }
//   next();
// });

// plugin for passport-local-mongoose
UserSchema.plugin(passportLocalMongoose)
mongoose.model('Transaction', TransactionSchema);
mongoose.model('Bill', BillSchema);

module.exports = mongoose.model('User', UserSchema);