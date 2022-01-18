const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')
const { date } = require('../../lib/utils')

module.exports = {
  async index(req, res) {
    const chefs = (await Chef.all()).rows

    const newChefsPromise = chefs.map(async chef => {
      let result = await Chef.getChefFile(chef.id)

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

    return res.render('admin/chefs/index', { chefs })
  },
  async create(req, res) {
    return res.render('admin/chefs/create')
  },
  async show(req, res) {
    const { id } = req.params

    const chef = (await Chef.find(id)).rows[0]
    const recipes = (await Chef.getRecipesOfChef(chef.id)).rows

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

    const file = await Chef.getChefFile(id)

    file.src = `${req.protocol}://${req.headers.host}${file.path.replace(
      'public',
      ''
    )}`

    return res.render('admin/chefs/show', { chef, recipes, file })
  },
  async edit(req, res) {
    const { id } = req.params

    const chef = (await Chef.find(id)).rows[0]

    const chefFile = await Chef.getChefFile(chef.id)
    chefFile.src = `${req.protocol}://${
      req.headers.host
    }${chefFile.path.replace('public', '')}`
    return res.render('admin/chefs/edit', { chef, file: chefFile })
  },
  async post(req, res) {
    const keys = Object.keys(req.body)

    for (key of keys) {
      if (req.body[key] == '') {
        return res.send('Please, fill all fields')
      }
    }

    if (req.files.length == 0) {
      return res.send('Please, send at least one image')
    }

    req.body.created_at = date(Date.now()).iso

    const fileId = await File.create(req.files[0])

    req.body.file_id = fileId

    const chefId = (await Chef.create(req.body)).rows[0].id

    return res.redirect(`/admin/chefs/${chefId}`)
  },
  async put(req, res) {
    try {
      let chef = req.body
      chef.id = Number(chef.id)

      if (req.files.length != 0) {
        chef.file_id = await File.create(req.files[0])
      } else {
        chef.file_id = (await Chef.getChefFile(chef.id)).file_id
      }

      await Chef.update(req.body)

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(',')
        const lastIndex = removedFiles.length - 1
        removedFiles.splice(lastIndex, 1)

        const removedFilesPromise = removedFiles.map(id => File.delete(id))

        await Promise.all(removedFilesPromise)
      }

      return res.redirect(`/admin/chefs/${req.body.id}`)
    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res) {
    const fileOfChefId = await Chef.getChefFile(req.body.id)

    await Chef.delete(req.body.id)

    await File.delete(fileOfChefId)

    return res.redirect(`/admin/chefs`)
  }
}
