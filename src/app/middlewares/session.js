const User = require('../models/User')
const Recipe = require('../models/Recipe')

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

async function onlyRightUserOrAdmin(req, res, next) {
  try {
    const user_id = await Recipe.getUserIdOfRecipe(req.params.id)
    const is_admin = await User.isAdmin(req.session.userId)

    if (!is_admin && user_id != req.session.userId) {
      req.body.error =
        'Somente o usuário criador dessa receita ou um administrador podem editá-la'
    }

    next()
  } catch (error) {
    console.error(error)
  }
}

async function onlyDeleteOtherUsers(req, res, next) {
  try {
    const user_id = req.body.id

    if (user_id == req.session.userId) {
      let users = await User.getAllUsersToList()
      return res.render('admin/users/list', {
        users,
        error: 'Você não pode deletar seu próprio usuário'
      })
    }

    next()
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  isLoggedRedirectToHome,
  isLoggedRedirectToUsers,
  onlyUsers,
  onlyAdmin,
  onlyRightUserOrAdmin,
  onlyDeleteOtherUsers
}
