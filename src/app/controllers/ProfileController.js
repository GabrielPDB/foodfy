const User = require('../models/User')

module.exports = {
  async index(req, res) {
    const user = await User.findById(req.session.userId)
    return res.render('admin/profile/index', { user })
  },
  async put(req, res) {
    let user = req.body

    user.id = req.session.userId

    await User.updateProfile(user)

    return res.redirect('/admin/users')
  }
}
