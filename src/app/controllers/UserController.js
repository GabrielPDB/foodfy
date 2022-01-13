const crypto = require('crypto')
const { hash } = require('bcryptjs')
const User = require('../models/User')

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

    /* enviar senha por email */

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
