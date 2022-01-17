const Recipe = require('../models/Recipe')
const File = require('../models/File')

module.exports = {
  async index(req, res) {
    const results = await Recipe.all()
    const recipes = results.rows

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

    return res.render('admin/recipes/index', { recipes })
  },
  async create(req, res) {
    const results = await Recipe.getChefsToSelectOptions()
    const chefs = results.rows

    return res.render('admin/recipes/create', { chefs })
  },
  async show(req, res) {
    try {
      const { id } = req.params
      const { error } = req.body

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

      return res.render('admin/recipes/show', { recipe, files, error })
    } catch (error) {
      console.error(error)
    }
  },
  async edit(req, res) {
    const { id } = req.params
    const { error } = req.body

    const results = await Recipe.find(id)
    const recipe = results.rows[0]
    const chefs = (await Recipe.getChefsToSelectOptions()).rows
    let files = (await Recipe.getRecipeFiles(id)).rows
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        'public',
        ''
      )}`
    }))

    if (error) {
      return res.render('admin/recipes/show', { recipe, files, error })
    }

    return res.render('admin/recipes/edit', { recipe, chefs, files })
  },
  async post(req, res) {
    try {
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

      req.body.user_id = req.session.userId

      let recipeId = await Recipe.create(req.body)

      const newFilesPromise = req.files.map(async file => {
        const fileId = await File.create(file)

        return await File.insertRecipeFile(fileId, recipeId)
      })

      await Promise.all(newFilesPromise)

      return res.redirect(`/admin/recipes/${recipeId}`)
    } catch (error) {
      console.error(error)
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body)
      for (key of keys) {
        if (req.body[key] == '' && key != 'removed_files') {
          if (!req.body['information'] == '') {
            const chefs = (await Recipe.getChefsToSelectOptions()).rows
            let files = (await Recipe.getRecipeFiles(req.body.id)).rows
            files = files.map(file => ({
              ...file,
              src: `${req.protocol}://${req.headers.host}${file.path.replace(
                'public',
                ''
              )}`
            }))
            return res.render('admin/recipes/edit', {
              recipe: req.body,
              chefs,
              files,
              error: 'Por favor, preencha todos os campos'
            })
          }
        }
      }
      if (req.files.length != 0) {
        const newFilesPromise = req.files.map(async file => {
          const fileId = await File.create(file)

          return await File.insertRecipeFile(fileId, req.body.id)
        })

        await Promise.all(newFilesPromise)
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(',')
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)

        let removedFilesPromise = removedFiles.map(async id =>
          File.deleteRecipeFileById(id)
        )

        await Promise.all(removedFilesPromise)

        removedFilesPromise = removedFiles.map(id => File.delete(id))

        await Promise.all(removedFilesPromise)
      }

      req.body.ingredients = req.body.ingredients.map(ingredient => {
        return `"${ingredient}"`
      })
      req.body.preparation = req.body.preparation.map(preparation => {
        return `"${preparation}"`
      })

      await Recipe.update(req.body)

      return res.redirect(`/admin/recipes/${req.body.id}`)
    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res) {
    const { id } = req.body

    let files = (await File.deleteAllFilesByRecipeId(id)).rows

    const deleteFilesPromise = files.map(file => File.delete(file.file_id))

    await Promise.all(deleteFilesPromise)

    await Recipe.delete(id)

    return res.redirect('/admin/recipes')
  }
}
