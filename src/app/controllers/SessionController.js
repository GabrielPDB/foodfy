module.exports = {
  async loginForm(req, res) {
    return res.render('session/login')
  },
  async login(req, res) {
    req.session.userId = req.user.id

    return res.redirect('/admin/users')
  },
  async logout(req, res) {
    req.session.destroy()
    return res.redirect('/')
  },
  async forgot(req, res) {
    return res.render('session/forgot')
  },
  async reset(req, res) {
    return res.render('session/reset')
  }
}
