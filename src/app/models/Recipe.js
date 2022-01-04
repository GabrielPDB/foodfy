const db = require('../../config/db')
const { date } = require('../../lib/utils')
const File = require('../models/File')

module.exports = {
  all() {
    try {
      return db.query(`
      SELECT recipes.id, recipes.title, chefs.name AS chef_name 
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    `)
    } catch (err) {
      console.error(err)
    }
  },
  create(data) {
    const query = `
      INSERT INTO recipes (
        chef_id,
        title,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, '{${data.ingredients}}', '{${data.preparation}}', $3, $4)
      RETURNING id
    `

    const values = [data.chef_id, data.title, data.information, data.created_at]

    return db.query(query, values)
  },
  find(id) {
    try {
      return db.query(
        `
      SELECT recipes.*, chefs.name AS chef_name FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
    `,
        [id]
      )
    } catch (error) {
      console.error(error)
    }
  },
  findBy(search) {
    try {
      return db.query(
        `
        SELECT recipes.id, recipes.title, recipes.image, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.title ILIKE '%${search}%'
      `
      )
    } catch (error) {
      console.error(error)
    }
  },
  update(data) {
    try {
      const query = `
      UPDATE recipes SET
        chef_id = ($1),
        title = ($2),
        ingredients = ('{${data.ingredients}}'),
        preparation = ('{${data.preparation}}'),
        information = ($3)
      WHERE id = $4
    `

      const values = [data.chef_id, data.title, data.information, data.id]

      return db.query(query, values)
    } catch (error) {
      console.error(error)
    }
  },
  getChefsToSelectOptions() {
    /* db.query(`SELECT * FROM chefs`, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    }) */
    try {
      return db.query(`SELECT * FROM chefs`)
    } catch (error) {
      console.error(error)
    }
  },
  delete(id) {
    try {
      return db.query(
        `
        DELETE FROM recipes WHERE id = $1
      `,
        [id]
      )
    } catch (error) {
      console.error(error)
    }
  },
  getRecipeFiles(recipe_id) {
    return db.query(
      `
        SELECT * FROM files
        LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
        WHERE recipe_files.recipe_id = $1
      `,
      [recipe_id]
    )
  },
  async getFirstImageOfRecipe(id) {
    try {
      let results = await db.query(
        `SELECT file_id FROM recipe_files WHERE recipe_id = $1`,
        [id]
      )

      return await File.findFileById(results.rows[0].file_id)
    } catch (error) {
      console.error(error)
    }
  }
}
