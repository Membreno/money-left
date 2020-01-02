const moment = require('moment');

module.exports = { // We export so methods can be accessed in our routes
  home: (req, res) => {
    res.render('index')
  },
  register: function (req, res) {
    if(!req.session.user_id){
      res.render('register')
    }
    else if (req.isAuthenticated()){
      res.redirect('/dashboard')
    }
  },
  login: function (req, res) {
    if(!req.session.user_id){
      res.render('login')
    }
    else if (req.isAuthenticated()){
      res.redirect('/dashboard')
    }
  },
  dashboard: function (req, res) {
    let today = moment(new Date()).format('YYYY-MM-DD');
    req.session.user_id = req.user.id // POSSIBLY NOT NEEDED
    res.render('dashboard', { name: req.user.name, bank: req.user.bank, today })
  }
}
