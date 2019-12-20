const express = require('express');
const app = express();

app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.render('index')
})
app.get('/ml/dashboard', (req, res) => {
  res.render('dashboard')
})
app.get('/ml/history', (req, res) => {
  res.render('history')
})
app.get('/ml/settings', (req, res) => {
  res.render('settings')
})
app.get('/login', (req, res) => {
  res.render('signin')
})
app.get('/signup', (req, res) => {
  res.render('signup')
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, _ => console.log(`Server started on port ${PORT}`));