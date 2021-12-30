const { date } = require('../../lib/utils')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
  async index(req, res) {
    const results = await Recipe.all()
    const recipes = results.rows

    return res.render('admin/recipes/index', { recipes })
  },
  async create(req, res) {
    const results = await Recipe.getChefsToSelectOptions()
    const chefs = results.rows

    return res.render('admin/recipes/create', { chefs })
  },
  async show(req, res) {
    const { id } = req.params

    let results = await Recipe.find(id)
    const recipe = results.rows[0]

    results = await Recipe.getRecipeFiles(recipe.id)
    const files = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        'public',
        ''
      )}`
    }))

    return res.render('admin/recipes/show', { recipe, files })
  },
  async edit(req, res) {
    const { id } = req.params

    const results = await Recipe.find(id)
    const recipe = results.rows[0]
    const chefs = (await Recipe.getChefsToSelectOptions()).rows

    return res.render('admin/recipes/edit', { recipe, chefs })
  },
  async post(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == '') {
        if (!req.body['information'] == '') {
          return res.send('Please, fill all fields')
        }
      }
    }

    if (req.files.length == 0) {
      return res.send('Please, send at least one image')
    }

    req.body.ingredients = req.body.ingredients.map(
      ingredient => `"${ingredient}"`
    )
    req.body.preparation = req.body.preparation.map(
      preparation => `"${preparation}"`
    )
    req.body.created_at = date(Date.now()).iso

    let results = await Recipe.create(req.body)
    const recipeId = results.rows[0].id

    req.files.forEach(async file => {
      results = await File.create(file)
      const fileId = results.rows[0].id

      results = await File.insertRecipeFile(fileId, recipeId)
    })

    /*  const filesPromise = req.files.map(file =>
      File.create({
        ...file,
        recipe_id: recipeId
      })
    ) */

    return res.redirect(`/admin/recipes/${recipeId}`)
  },
  async put(req, res) {
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
  },
  async delete(req, res) {
    const { id } = req.body

    Recipe.delete(id, () => {
      return res.redirect('/admin/recipes')
    })
  }
}
