const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')

exports.index = (req, res) => {
  Recipe.all(recipes => {
    return res.render('admin/recipes/index', { recipes })
  })
}

exports.create = (req, res) => {
  Recipe.getChefsToSelectOptions(chefs => {
    return res.render('admin/recipes/create', { chefs })
  })
}

exports.show = (req, res) => {
  const { id } = req.params

  Recipe.find(id, recipe => {
    return res.render('admin/recipes/show', { recipe })
  })
}

exports.edit = (req, res) => {
  const { id } = req.params

  Recipe.find(id, recipe => {
    Recipe.getChefsToSelectOptions(chefs => {
      return res.render('admin/recipes/edit', { recipe, chefs })
    })
  })
}

exports.post = (req, res) => {
  const keys = Object.keys(req.body)

  for (key of keys) {
    if (req.body[key] == '') {
      if (!req.body['information'] == '') {
        return res.send('Please, fill all fields')
      }
    }
  }

  req.body.ingredients = req.body.ingredients.map(ingredient => {
    return `"${ingredient}"`
  })
  req.body.preparation = req.body.preparation.map(preparation => {
    return `"${preparation}"`
  })
  req.body.created_at = date(Date.now()).iso

  /* return res.send(req.body) */

  Recipe.create(req.body, recipe => {
    return res.redirect(`/admin/recipes/${recipe.id}`)
  })
}

exports.put = (req, res) => {
  const keys = Object.keys(req.body)

  for (key of keys) {
    if (req.body[key] == '') {
      if (!req.body['information'] == '') {
        return res.send('Please, fill all fields')
      }
    }
  }

  req.body.ingredients = req.body.ingredients.map(ingredient => {
    return `"${ingredient}"`
  })
  req.body.preparation = req.body.preparation.map(preparation => {
    return `"${preparation}"`
  })

  Recipe.update(req.body, () => {
    return res.redirect(`/admin/recipes/${req.body.id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body

  Recipe.delete(id, () => {
    return res.redirect('/admin/recipes')
  })
}
