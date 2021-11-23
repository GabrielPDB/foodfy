const fs = require('fs')
const data = require('../../../data.json')
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

  const foundRecipe = data.recipes.find(recipe => {
    return recipe.id == id
  })

  return res.render('admin/recipes/edit', { recipe: foundRecipe })
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

  const { id } = req.body
  let index = 0

  const foundRecipe = data.recipes.find((recipe, foundIndex) => {
    if (id == recipe.id) {
      index = foundIndex
      return true
    }
  })

  if (!foundRecipe) {
    return res.send('Recipe not found')
  }

  const recipe = {
    ...foundRecipe,
    ...req.body,
    id: Number(id)
  }

  data.recipes[index] = recipe

  fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
    if (err) return res.send('Write file error' + err)
    return res.redirect(`/admin/recipes/${id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body

  const filteredRecipes = data.recipes.filter(recipe => {
    return recipe.id != id
  })

  data.recipes = filteredRecipes

  fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
    if (err) return res.send('Write file error' + err)
    return res.redirect(`/admin/recipes`)
  })
}
