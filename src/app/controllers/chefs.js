const Chef = require('../models/Chef')
const { date } = require('../../lib/utils')

exports.index = (req, res) => {
  return res.render('admin/chefs/index')
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
  return res.render('admin/chefs/edit')
}

exports.post = (req, res) => {
  req.body.created_at = date(Date.now()).iso

  Chef.create(req.body, chef => {
    return res.redirect(`/admin/chefs/${chef.id}`)
  })
}

exports.put = (req, res) => {
  return res.send('chef put')
}

exports.delete = (req, res) => {
  return res.send('chef delete')
}
