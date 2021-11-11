const fs = require('fs')
const data = require('../data.js')

exports.index = (req, res) => {
  return res.render('admin/index', { recipes: data })
}

exports.create = (req, res) => {
  return res.send('create')
}

exports.show = (req, res) => {
  const { id } = req.params

  const foundRecipe = data.find(recipe => {
    return recipe.id == id
  })

  return res.render('admin/show', { recipe: foundRecipe })
}

exports.edit = (req, res) => {
  return res.send('edit')
}

exports.post = (req, res) => {
  return res.send('post')
}

exports.put = (req, res) => {
  return res.send('put')
}

exports.delete = (req, res) => {
  return res.send('delete')
}
