const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const { date } = require('../../lib/utils')

exports.home = async (req, res) => {
  let recipes = (await Recipe.all()).rows

  const newRecipes = recipes.map(async recipe => {
    let result = (await Recipe.getFirstImageOfRecipe(recipe.id)).rows[0]

    recipe.image = {
      ...result,
      src: `${req.protocol}://${req.headers.host}${result.path.replace(
        'public',
        ''
      )}`
    }
    return recipe
  })

  await Promise.all(newRecipes)

  return res.render('site/home', { recipes })
}

exports.about = async (req, res) => {
  return res.render('site/about')
}

exports.recipes = async (req, res) => {
  const { search } = req.query
  let recipes = ''

  if (search == '' || !search) {
    recipes = (await Recipe.all()).rows
    const newRecipes = recipes.map(async recipe => {
      let result = (await Recipe.getFirstImageOfRecipe(recipe.id)).rows[0]

      recipe.image = {
        ...result,
        src: `${req.protocol}://${req.headers.host}${result.path.replace(
          'public',
          ''
        )}`
      }
      return recipe
    })

    await Promise.all(newRecipes)

    return res.render('site/recipes', { recipes, search })
  } else {
    recipes = (await Recipe.findBy(search)).rows
    const newRecipes = recipes.map(async recipe => {
      let result = (await Recipe.getFirstImageOfRecipe(recipe.id)).rows[0]

      recipe.image = {
        ...result,
        src: `${req.protocol}://${req.headers.host}${result.path.replace(
          'public',
          ''
        )}`
      }
      return recipe
    })

    await Promise.all(newRecipes)
    return res.render('site/recipes', { recipes, search })
  }
}

exports.recipeInfo = async (req, res) => {
  const { id } = req.params

  const recipe = (await Recipe.find(id)).rows[0]

  let results = await Recipe.getRecipeFiles(recipe.id)
  const files = results.rows.map(file => ({
    ...file,
    src: `${req.protocol}://${req.headers.host}${file.path.replace(
      'public',
      ''
    )}`
  }))

  return res.render('site/info', { recipe, files })
}

exports.chefs = async (req, res) => {
  const chefs = (await Chef.all()).rows
  return res.render('site/chefs', { chefs })
}
