const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const { date } = require('../../lib/utils')

module.exports = {
  async home(req, res) {
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
  },
  async about(req, res) {
    return res.render('site/about')
  },
  async recipes(req, res) {
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

      if (recipes.length == 0) {
        return res.render('site/recipes', {
          search,
          error: 'Nenhuma receita encontrada'
        })
      }

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

      if (recipes.length == 0) {
        return res.render('site/recipes', {
          search,
          error: 'Nenhuma receita encontrada'
        })
      }

      return res.render('site/recipes', { recipes, search })
    }
  },
  async recipeInfo(req, res) {
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
  },
  async chefs(req, res) {
    const chefs = (await Chef.all()).rows

    const newChefsPromise = chefs.map(async chef => {
      let result = (await Chef.getChefFile(chef.id)).rows[0]

      chef.image = {
        ...result,
        src: `${req.protocol}://${req.headers.host}${result.path.replace(
          'public',
          ''
        )}`
      }
      return chef
    })

    await Promise.all(newChefsPromise)

    return res.render('site/chefs', { chefs })
  }
}
