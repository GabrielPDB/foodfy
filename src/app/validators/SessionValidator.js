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

async function login(req, res, next) {
  try {
    if (!isAllFieldsFilled(req.body)) {
      return res.render('session/login', {
        user: req.body,
        error: 'Por favor, preencha todos os campos'
      })
    }

    const { email, password } = req.body

    const user = await User.findByEmail(email)

    if (!user) {
      return res.render('session/login', {
        user: req.body,
        error: 'Usuário não encontrado!'
      })
    }

    const passed = await compare(password, user.password)

    if (!passed)
      return res.render('session/login', {
        user: req.body,
        error: 'Senha incorreta'
      })

    req.user = user

    next()
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  login
}
