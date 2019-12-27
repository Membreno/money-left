// AUTHORIZE CODE HERE
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const flash = require('express-flash');
const User = mongoose.model('User');

module.exports = { // We export so methods can be accessed in our routes
  register: function (req, res) {
    if(!EMAIL_REGEX.test(req.body.email)){
      req.flash('email', "Email must be valid");
    }
    else if (req.body.password != req.body.confirm){
      req.flash('reg_password', "Password must match");
      // return res.redirect('/signup')
    }
    let hash = bcrypt.hashSync(req.body.password, 10);
    // console.log("Hashed Password ", hash);
    // console.log(bcrypt.compareSync(req.body.password, hash) );
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    user.save(function(err){
      if(err){
        console.log("MADE IT TO SAVE w/ error\n" + err);
        for (let key in err.errors) {
          req.flash(key, err.errors[key].message)
        }
        res.redirect('/signup');
      } else {
        console.log("Successfully added user!");
        console.log(user);
        res.redirect('/')
      }
    })
  },
  login: function (req, res) {
    res.render('signin')
  },
}

/* 
app.post('/register', function (req, res) {
  console.log('****** IN Registration ROUTE ******');
  if (req.body.password.length < 8) {
    req.flash('registration', "Password must be at least 8 characters")
  } else if (req.body.password != req.body.confirm) {
    req.flash('registration', "Password must match");
    return res.redirect('/')
  }
  var hash = bcrypt.hashSync(req.body.password, 10);

  // console.log("Hashed Password", hash);
  // console.log(bcrypt.compareSync(req.body.password, hash) );
  const user = new User({
    fname: req.body.first_name,
    lname: req.body.last_name,
    email: req.body.email,
    birthday: req.body.birthday,
    password: hash
  })

  user.save(function (err) {
    if (err) {
      console.log("Oh NOES!!! Something went wrong");
      for (var key in err.errors) {
        req.flash('registration', err.errors[key].message);
      }
      res.redirect('/')
    } else {
      console.log("Successfully added user!");
      console.log(user);
      req.session.user_id = user._id;
      res.redirect('/success')
    }
  })
});

app.get('/success', function (req, res) {
  if (req.session.user_id == undefined) {
    console.log("User is currently not signed in");
    res.redirect('/')
  } else {
    console.log(req.session.user_id);
    console.log("User is now logged in");
    console.log("SESSION ID AT SUCCESS RENDER: ", req.session.user_id);

    User.find({
      _id: req.session.user_id
    }, function (err, user) {
      console.log(user[0].fname);
      var fname = user[0].fname;
      res.render('success', {
        user_name: fname
      });
    })
  }
})
*/ 