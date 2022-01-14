const crypto = require('crypto')
const { hash } = require('bcryptjs')
const User = require('../models/User')
const mailer = require('../../lib/mailer')

module.exports = {
  async list(req, res) {
    // pegar todos os usuários
    return res.render('admin/users/list')
  },
  async post(req, res) {
    let user = req.body

    if (user.is_admin == 'on') {
      user.is_admin = true
    } else {
      user.is_admin = false
    }

    let password = crypto.randomBytes(10).toString('hex')

    user.password = await hash(password, 8)

    let userId = await User.create(user)

    /* send password by email */

    await mailer.sendMail({
      to: user.email,
      from: 'no-reply@foodfy.com.br',
      subject: 'Aqui está seu login do Foodfy',
      html: `
        <h2>Bem vindo ao Foodfy</h2>
        <p>Aqui estão seus dados para login</p>
        <p>Email: <strong>${user.email}</strong></p>
        <p>Senha: <strong>${password}</strong></p>
      `
    })

    return res.redirect('/admin/users')
  },
  async create(req, res) {
    return res.render('admin/users/create')
  },
  async put(req, res) {
    return res.send('user put')
  },
  async edit(req, res) {
    //pegar usuário
    return res.render('admin/users/edit')
  },
  async delete(req, res) {
    return res.send('user delete')
  }
}
