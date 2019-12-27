const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Connecting out models to mongoose
let models_path = path.join(__dirname, '../models');
fs.readdirSync(models_path).forEach(function (file) {
  if (file.indexOf('.js') >= 0) {
    require(models_path + '/' + file);
  }
});

// Connect to Mongo
mongoose.connect(process.env.MONGOURI, {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true
})
  .then(_ => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));