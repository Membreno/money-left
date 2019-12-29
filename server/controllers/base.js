module.exports = { // We export so methods can be accessed in our routes
  home: (req, res) => {
    res.render('index')
  },
  register: function (req, res) {
    res.render('register')
  },
  login: function (req, res) {
    res.render('login')
  },
  dashboard: function (req, res) {
    req.session.user_id = req.user.id // POSSIBLY NOT NEEDED
    console.log("Dashboard ID: " + req.session.user_id)
    res.render('dashboard', { name: req.user.name, bank: req.user.bank })
  }
}
