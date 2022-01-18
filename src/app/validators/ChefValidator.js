const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const File = require('../models/File')

async function getChefFileToFront(req) {
  const chefFile = await Chef.getChefFile(req.body.id)
  chefFile.src = `${req.protocol}://${req.headers.host}${chefFile.path.replace(
    'public',
    ''
  )}`

  return chefFile
}

module.exports = {
  async put(req, res, next) {
    try {
      const chef = req.body

      const keys = Object.keys(chef)

      for (key of keys) {
        if (req.body[key] == '' && key != 'removed_files') {
          let file = await getChefFileToFront(req)
          return res.render('admin/chefs/edit', {
            chef,
            file,
            error: 'Preencha todos os campos'
          })
        }
      }

      if (chef.removed_files != '' && req.files.length == 0) {
        let file = await getChefFileToFront(req)
        return res.render('admin/chefs/edit', {
          chef,
          file,
          error: 'Preencha todos os campos'
        })
      }

      next()
    } catch (error) {
      console.error(error)
    }
  },
  async delete(req, res, next) {
    try {
      const chef = req.body
      const recipes = (await Chef.getRecipesOfChef(chef.id)).rows

      if (recipes.length > 0) {
        let file = await getChefFileToFront(req)
        return res.render('admin/chefs/edit', {
          chef,
          file,
          error:
            'Esse chef não pode ser excluído porque tem receitas cadastradas'
        })
      }
    } catch (error) {
      console.error(error)
    }
  }
}
