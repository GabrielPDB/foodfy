module.exports = {
  async list(req, res) {
    return res.send('user list')
  },
  async post(req, res) {
    return res.send('user post')
  },
  async create(req, res) {
    return res.render('admin/users/create')
  },
  async put(req, res) {},
  async edit(req, res) {},
  async delete(req, res) {}
}
