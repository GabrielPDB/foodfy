const fs = require('fs')
const data = require('../../../data.json')

exports.index = (req, res) => {
  return res.render('admin/recipes/index', { recipes: data.recipes })
}

exports.create = (req, res) => {
  return res.render('admin/recipes/create')
}

exports.show = (req, res) => {
  const { id } = req.params

  const foundRecipe = data.recipes.find(recipe => {
    return recipe.id == id
  })

  return res.render('admin/recipes/show', { recipe: foundRecipe })
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

  let id = 1
  const lastRecipe = data.recipes[data.recipes.length - 1]
  if (lastRecipe) {
    id = lastRecipe.id + 1
  }

  data.recipes.push({
    ...req.body,
    id
  })

  fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
    if (err) return res.send('Write file error' + err)
    return res.redirect(`/admin/recipes/${id}`)
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
