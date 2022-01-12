module.exports = {
  async list(req, res) {
    // pegar todos os usuários
    return res.render('admin/users/list')
  },
  async post(req, res) {
    return res.send('user post')
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
