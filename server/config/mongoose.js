const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

mongoose.connect('mongodb://localhost/money_left', {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true
});
mongoose.Promise = global.Promise;
// Connecting out models to mongoose
let models_path = path.join(__dirname, '../models');
fs.readdirSync(models_path).forEach(function(file){
  if (file.indexOf('.js') >= 0) {
    require(models_path + '/' + file);
  }
});
console.log("Passing through the MONGOOSE file");