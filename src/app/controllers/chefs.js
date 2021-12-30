const Chef = require('../models/Chef')
const { date } = require('../../lib/utils')

exports.index = async (req, res) => {
  const chefs = (await Chef.all()).rows
  return res.render('admin/chefs/index', { chefs })
}

exports.create = async (req, res) => {
  return res.render('admin/chefs/create')
}

exports.show = async (req, res) => {
  const { id } = req.params

  const chef = (await Chef.find(id)).rows[0]
  const recipes = (await Chef.getRecipesOfChef(chef)).rows

  return res.render('admin/chefs/show', { chef, recipes })
}

exports.edit = async (req, res) => {
  const { id } = req.params

  const chef = (await Chef.find(id)).rows[0]

  return res.render('admin/chefs/edit', { chef })
}

exports.post = async (req, res) => {
  const keys = Object.keys(req.body)

  for (key of keys) {
    if (req.body[key] == '') {
      return res.send('Please, fill all fields')
    }
  }

  req.body.created_at = date(Date.now()).iso

  const chefId = (await Chef.create(req.body)).rows[0].id

  return res.redirect(`/admin/chefs/${chef.id}`)
}

exports.put = async (req, res) => {
  const keys = Object.keys(req.body)

  for (key of keys) {
    if (req.body[key] == '') {
      return res.send('Please, fill all fields')
    }
  }

  req.body.id = Number(req.body.id)

  await Chef.update(req.body)

  return res.redirect(`/chefs/${req.body.id}`)
}

exports.delete = async (req, res) => {
  const recipes = (await Chef.getRecipesOfChef(req.body.id)).rows

  if (recipes.length > 0) {
    return res.send(
      `Esse chef tem receitas cadastradas. Não é possível excluí-lo`
    )
  } else {
    await Chef.delete(req.body.id)

    return res.redirect(`/admin/chefs`)
  }
}
