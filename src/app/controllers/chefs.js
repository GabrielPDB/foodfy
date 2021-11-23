const Chef = require('../models/Chef')
const { date } = require('../../lib/utils')

exports.index = (req, res) => {
  Chef.all(chefs => {
    return res.render('admin/chefs/index', { chefs })
  })
}

exports.create = (req, res) => {
  return res.render('admin/chefs/create')
}

exports.show = (req, res) => {
  const { id } = req.params

  Chef.find(id, chef => {
    return res.render('admin/chefs/show', { chef })
  })
}

exports.edit = (req, res) => {
  const { id } = req.params

  Chef.find(id, chef => {
    return res.render('admin/chefs/edit', { chef })
  })
}

exports.post = (req, res) => {
  const keys = Object.keys(req.body)

  for (key of keys) {
    if (req.body[key] == '') {
      return res.send('Please, fill all fields')
    }
  }

  req.body.created_at = date(Date.now()).iso

  Chef.create(req.body, chef => {
    return res.redirect(`/admin/chefs/${chef.id}`)
  })
}

exports.put = (req, res) => {
  const keys = Object.keys(req.body)

  for (key of keys) {
    if (req.body[key] == '') {
      return res.send('Please, fill all fields')
    }
  }

  req.body.id = Number(req.body.id)

  Chef.update(req.body, () => {
    return res.redirect(`/chefs/${req.body.id}`)
  })
}

exports.delete = (req, res) => {
  Chef.delete(req.body.id, () => {
    return res.redirect(`/admin/chefs`)
  })
}
