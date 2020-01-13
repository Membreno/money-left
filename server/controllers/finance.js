const mongoose = require('mongoose'),
      User = require('../models/USER'),
      Transaction = mongoose.model('Transaction'),
      Bill = mongoose.model('Bill'),
      moment = require('moment');

module.exports = {
  // TRANSACTION METHODS
  transaction: (req, res) => {
    const {
      amount,
      date,
      impact
    } = req.body;
    // Styling for transactions
    const bank = req.body.impact === 'pos' ?
     updateBank(req.body.bank, amount, 'pos'):
     updateBank(req.body.bank, amount, 'neg');

    function updateBank(bank, adjustment, impact){
      if(impact === 'pos'){
        return (Number(bank) + Number(adjustment))
      }
      return (Number(bank) - Number(adjustment))
    }
    // Format transaction name
    let name = req.body.name;
    name = name.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');

    // Validation Passed
    const transaction = new Transaction({amount, name, date, impact, bank})
    transaction.save(
      User.findOne({_id: req.session.user_id}, function(err, user){
        user.transactions.push(transaction)
        user.bank = (bank).toFixed(2);
        user.save()
          .then(_ => {
            req.flash('success_msg', 'You completed a transaction')
            res.redirect('/dashboard')
          })
          .catch(err =>{
            console.log(err)
            res.redirect('/dashboard')
          })
      })
    )
  },

  history: function (req, res) {
    User.findOne({_id: req.session.user_id}, function (err, user){
      if(!err){
        let transactions = user.transactions;
        transactions = transactions.sort((a, b) => {
          return (a.createdAt < b.createdAt) ? 1 : -1
        })
        const formatDate = function (timestamp) {
          return moment(timestamp).format('MMMM DD, YYYY');
        }
        res.render('history', { transactions, formatDate })
      }
    })
  },

  // BILLING METHOD
  add_bill: function(req, res){
    // Need to format date before saving for the correct date to show
    const date = moment(req.body.date).format('YYYY/MM/DD')
    const {
      amount,
      repeats
    } = req.body;
    // Format bill name
    let name = req.body.name;
    name = name.toLowerCase()
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' ');

    // Validation Passed
    const bill = new Bill ({name, amount, date, repeats});
    bill.save(
      User.findOne({_id: req.session.user_id}, function (err, user){
        if(!err){
          user.bills.push(bill)
          user.save()
            .then(_ => {
              req.flash('success_msg', 'You added a new bill')
              res.redirect('/dashboard')
            })
            .catch(err => {
              console.log(err)
              req.flash('error_msg', "Something went wrong. Couldn't add new bill")
              res.redirect('/dashboard')
            })
        }
      })
    )
  },

  pay_bill: (req, res) => {
    console.log('Made it to PAY BILL')
    User.findOne({
      _id: req.session.user_id
    }, function (err, user) {
      if (!err) {
        let bills = user.bills
        let today = moment(new Date()).format('YYYY-MM-DD');
        bills.forEach(bill => {
          if (bill.id === req.body.bill_id) {
            const userBank = Number(user.bank) - Number(bill.amount)
            const transaction = new Transaction({
              amount: bill.amount,
              name: bill.name,
              date: today,
              impact: 'neg',
              bank: userBank
            })
            transaction.save(
              User.findOne({
                _id: req.session.user_id
              }, function (err, user) {
                user.transactions.push(transaction)
                user.bank = userBank
                user.save()
                  .then(_ => {
                    req.flash('success_msg', 'You successfully paid a bill')
                    res.redirect('/dashboard')
                  })
                  .catch(err => {
                    console.log(err)
                    res.redirect('/dashboard')
                  })
              })
            )
          }
        })
      }
    })
  },

  // UPDATE METHODS
  initiate_update: function (req, res) {
    req.session.bill_id = req.body.bill_id
    res.redirect('/update')
  },

  save_update: function (req, res){
    if(!req.session.bill_id){
      res.redirect('/dashboard')
    } else {
      User.findOne({_id: req.session.user_id}, function (err, user){
        if(!err){
          let bills = user.bills
          bills.forEach(bill =>{
            if(bill.id === req.session.bill_id){
              bill.name = req.body.name;
              bill.amount = req.body.amount;
              bill.date = moment(req.body.date).format('YYYY/MM/DD');
            }
          })
        }
        user.save()
        res.redirect('/dashboard')
      })
    }
  },

  // DELETE METHODS
  delete_bill: function (req, res) {
    User.findOne({_id: req.session.user_id}, function (err, user) {
      if (!err) {
        user.bills.pull({_id: req.session.bill_id})
        user.save()
        Bill.deleteOne({_id: req.session.bill_id}, function (err){
          if(!err){
            res.redirect('/dashboard')
          }
        })
      }
    })
  },
}