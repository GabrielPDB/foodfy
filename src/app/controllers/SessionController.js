const User = require('../models/User')
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')
const crypto = require('crypto')

module.exports = {
  async loginForm(req, res) {
    return res.render('session/login')
  },
  async login(req, res) {
    req.session.userId = req.user.id

    return res.redirect('/admin/profile')
  },
  async logout(req, res) {
    req.session.destroy()
    return res.redirect('/')
  },
  async forgotForm(req, res) {
    return res.render('session/forgot')
  },
  async forgot(req, res) {
    try {
      const user = req.user

      const token = crypto.randomBytes(20).toString('hex')

      let now = new Date()
      now = now.setHours(now.getHours() + 1)

      user.reset_token = token
      user.reset_token_expires = now

      await User.updateUserToken(user)

      await mailer.sendMail({
        to: user.email,
        from: 'no-reply@foodfy.com.br',
        subject: 'Recuperação de senha',
        html: `
          <h2>Esqueceu a senha?</h2>
          <p>Não se preocupe com isso, clique no link abaixo para recuperar a sua senha</p>
          <p>
            <a href="http://localhost:3000/reset?token=${token}" target="_blank">Recuperar senha</a>
          </p>
        `
      })

      return res.render('session/forgot', {
        success: 'Verifique seu email para redefinir sua senha!'
      })
    } catch (error) {
      console.error(error)
      return res.render('session/forgot', {
        error: 'Erro inesperado, tente novamente!'
      })
    }
  },
  async resetForm(req, res) {
    return res.render('session/reset', { token: req.query.token })
  },
  async reset(req, res) {
    try {
      const { user } = req
      const { password, token } = req.body

      const newPassword = await hash(password, 8)

      await User.update(user.id, {
        password: newPassword,
        reset_token: '',
        reset_token_expires: ''
      })

      return res.render('session/login', {
        user: req.body,
        success: 'Senha atualizada com sucesso! Faça seu login'
      })
    } catch (error) {
      console.error(error)
      return res.render('session/reset', {
        user: req.body,
        token,
        error: 'Erro inesperado, tente novamente!'
      })
    }
  }
}
