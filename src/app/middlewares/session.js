const User = require('../models/User')

function isLoggedRedirectToUsers(req, res, next) {
  if (req.session.userId) return res.redirect('/admin/users')
  next()
}

function isLoggedRedirectToHome(req, res, next) {
  if (req.session.userId) return res.redirect('/')
  next()
}

function onlyUsers(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login')
  }

  next()
}

function onlyAdmin(req, res, next) {
  if (!User.isAdmin(req.session.userId)) {
    return res.redirect('/login')
  }

  next()
}

module.exports = {
  isLoggedRedirectToHome,
  isLoggedRedirectToUsers,
  onlyUsers,
  onlyAdmin
}
