const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
  all(callback) {
    db.query(
      `
      SELECT recipes.id, recipes.title, chefs.name AS chef_name FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    `,
      (err, results) => {
        if (err) throw `Database error! ${err}`

        callback(results.rows)
      }
    )
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
  find(id, callback) {
    db.query(
      `
      SELECT recipes.*, chefs.name AS chef_name FROM recipes 
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
    `,
      [id],
      (err, results) => {
        if (err) throw `Database error! ${err}`

        callback(results.rows[0])
      }
    )
  },
  findBy(search, callback) {
    db.query(
      `
      SELECT recipes.id, recipes.title, recipes.image, chefs.name AS chef_name 
      FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
      WHERE recipes.title ILIKE '%${search}%'
    `,
      function (err, results) {
        if (err) throw `Database Error! ${err}`

        callback(results.rows)
      }
    )
  },
  update(data, callback) {
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

    db.query(query, values, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback()
    })
  },
  getChefsToSelectOptions(callback) {
    db.query(`SELECT * FROM chefs`, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    })
  },
  delete(id, callback) {
    db.query(
      `
      DELETE FROM recipes WHERE id = $1
    `,
      [id],
      (err, results) => {
        if (err) throw `Database error! ${err}`

        callback()
      }
    )
  },
  getRecipeFiles(recipe_id) {
    return db.query(
      `
        SELECT * FROM files
        LEFT JOIN recipe_files ON (files.id = recipes_files.file_id)
        WHERE recipe_files.recipe_id = $1
      `,
      [recipe_id]
    )
  }
}
