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

async function forgot(req, res, next) {
  try {
    const { email } = req.body

    let user = await User.findByEmail(email)

    if (!user) {
      return res.render('session/forgot', {
        user: req.body,
        error: 'Email não cadastrado!'
      })
    }

    req.user = user

    next()
  } catch (error) {
    console.error(error)
  }
}

async function reset(req, res, next) {
  try {
    const { email, password, passwordRepeat, token } = req.body

    const user = await User.findByEmail(email)

    if (!user) {
      return res.render('session/reset', {
        user: req.body,
        token,
        error: 'Usuário não encontrado!'
      })
    }

    if (password != passwordRepeat) {
      return res.render('session/reset', {
        user: req.body,
        token,
        error: 'A senha e a repetição estão incorretas'
      })
    }

    if (token != user.reset_token)
      return res.render('session/reset', {
        user: req.body,
        token,
        error: 'Token inválido! Solicite uma nova recuperação de senha'
      })

    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) {
      return res.render('session/reset', {
        user: req.body,
        token,
        error:
          'Token expirado! Por favor, solicite uma nova recuperação de senha'
      })
    }

    req.user = user

    next()
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  login,
  forgot,
  reset
}
