const db = require('../../config/db')
const fs = require('fs')

module.exports = {
  create({ filename, path }) {
    const query = `
      INSERT INTO files (
        name, path
      ) VALUES ($1, $2)
      RETURNING id
    `

    const values = [filename, path]

    return db.query(query, values)
  },
  insertRecipeFile(fileId, recipeId) {
    const query = `
      INSERT INTO recipe_files (
        recipe_id, file_id
      ) VALUES ($1, $2)
      RETURNING id
    `

    const values = [recipeId, fileId]

    return db.query(query, values)
  }
}
