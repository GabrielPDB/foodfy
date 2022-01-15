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

async function onlyAdmin(req, res, next) {
  const isAdmin = await User.isAdmin(req.session.userId)

  if (!isAdmin) {
    let users = await User.getAllUsersToList()
    return res.render('admin/users/list', {
      users,
      error: 'Você não tem permissão!'
    })
  }

  next()
}

module.exports = {
  isLoggedRedirectToHome,
  isLoggedRedirectToUsers,
  onlyUsers,
  onlyAdmin
}
