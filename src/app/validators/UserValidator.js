const User = require('../models/User')
const { compare } = require('bcryptjs')

function isAllFieldsFilled(body) {
  const keys = Object.keys(body)

  for (key of keys) {
    if (body[key] == '') {
      return false
    }
  }
  return true
}

async function post(req, res, next) {
  try {
    if (!isAllFieldsFilled(req.body)) {
      return res.render('admin/users/create', {
        user: req.body,
        error: 'Por favor, preencha todos os campos'
      })
    }

    //check if user already exists

    let { email } = req.body

    const user = await User.findByEmail(email)

    if (user) {
      return res.render('admin/users/create', {
        user: req.body,
        error: 'Usuário já cadastrado!'
      })
    }

    next()
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  post
}
