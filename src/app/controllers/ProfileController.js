const User = require('../models/User')

module.exports = {
  async index(req, res) {
    const user = await User.findById(9)
    return res.render('admin/profile/index', { user })
  },
  async put(req, res) {
    return res.send('Editar o usuário logado')
  }
}
