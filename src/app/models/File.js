const db = require('../../config/db')
const fs = require('fs')

module.exports = {
  async create({ filename, path }) {
    try {
      const query = `
    INSERT INTO files (
      name, path
    ) VALUES ($1, $2)
    RETURNING id
  `

      const values = [filename, path]

      const results = await db.query(query, values)
      return results
    } catch (err) {
      console.error(err)
    }
  },
  async insertRecipeFile(fileId, recipeId) {
    try {
      const query = `
      INSERT INTO recipe_files (
        recipe_id, file_id
      ) VALUES ($1, $2)
      RETURNING id
    `

      const values = [recipeId, fileId]

      const results = await db.query(query, values)
      return results
    } catch (err) {
      console.error(err)
    }
  },
  async delete(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
      const file = result.rows[0]

      fs.unlinkSync(file.path)

      return db.query(`DELETE FROM files WHERE id = $1`, [id])
    } catch (err) {
      console.error(err)
    }
  },
  findFileById(id) {
    try {
      return db.query('SELECT * FROM files WHERE id = $1', [id])
    } catch (error) {
      console.error(error)
    }
  },
  deleteAllFilesByRecipeId(recipeId) {
    try {
      return db.query(
        `DELETE FROM recipe_files WHERE recipe_id = $1 RETURNING file_id`,
        [recipeId]
      )
    } catch (error) {}
  },
  deleteRecipeFileById(fileId) {
    try {
      return db.query(
        `DELETE FROM recipe_files WHERE file_id = $1 RETURNING file_id`,
        [fileId]
      )
    } catch (error) {}
  }
}
