const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
  all() {
    try {
      return db.query(
        `
        SELECT chefs.*, count(recipes) AS total_recipes 
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        GROUP BY chefs.id
      `
      )
    } catch (error) {
      console.error(error)
    }
  },
  create(data) {
    try {
      const query = `
      INSERT INTO chefs (
        name,
        created_at,
        file_id
      ) VALUES ($1, $2, $3)
      RETURNING id
    `

      const values = [data.name, data.created_at, data.file_id]

      return db.query(query, values)
    } catch (error) {
      console.error(error)
    }
  },
  find(id) {
    try {
      return db.query(
        `
        SELECT chefs.*, count(recipes) AS total_recipes 
        FROM chefs 
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id
      `,
        [id]
      )
    } catch (error) {
      console.error(error)
    }
  },
  getRecipesOfChef(id) {
    try {
      return db.query(
        `
      SELECT * FROM recipes
      WHERE chef_id = $1
      `,
        [id]
      )
    } catch (error) {
      console.error(error)
    }
  },
  async getChefFile(chef_id) {
    try {
      let query = `
      SELECT files.id AS file_id, files.name, files.path FROM files
      LEFT JOIN chefs ON (files.id = chefs.file_id)
      WHERE chefs.id = ${chef_id}
    `
      let results = (await db.query(query)).rows[0]
      return results
    } catch (error) {
      console.error(error)
    }
  },
  update(data) {
    try {
      const query = `
    UPDATE chefs SET
      name = ($1),
      file_id = ($2)
    WHERE id = $3
  `

      const values = [data.name, data.file_id, data.id]

      return db.query(query, values)
    } catch (error) {
      console.error(error)
    }
  },
  delete(id) {
    try {
      return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    } catch (error) {
      console.error(error)
    }
  }
}
