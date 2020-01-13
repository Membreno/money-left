const mongoose = require('mongoose');

// Connect to Mongo...
// Set the option for autoIndex to false to prevent duplicate key error
mongoose.connect(process.env.MONGOURI, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
   autoIndex: false
})
  .then(_ => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));