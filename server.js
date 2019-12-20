const express = require('express');
const app = express();

app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index')
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, _ => console.log(`Server started on port ${PORT}`));