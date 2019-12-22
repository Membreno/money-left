const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
    minlength: [2, "Name must be at least two characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password field is required"]
  }
}, {timestamps: true});

mongoose.model('User', UserSchema);