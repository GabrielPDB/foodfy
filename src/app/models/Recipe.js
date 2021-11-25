const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
  all(callback) {
    db.query(
      `
      SELECT recipes.id, recipes.title, recipes.image, chefs.name AS chef_name FROM recipes
      LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
    `,
      (err, results) => {
        if (err) throw `Database error! ${err}`

        callback(results.rows)
      }
    )
  },
  create(data, callback) {
    let query = `
      INSERT INTO recipes (
        chef_id,
        image,
        title,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, '{${data.ingredients}}', '{${data.preparation}}', $4, $5)
      RETURNING id
    `

    const values = [
      data.chef_id,
      data.image,
      data.title,
      data.information,
      data.created_at
    ]

    db.query(query, values, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows[0])
    })
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
  update(data, callback) {
    const query = `
      UPDATE recipes SET
        chef_id = ($1),
        image = ($2),
        title = ($3),
        ingredients = ('{${data.ingredients}}'),
        preparation = ('{${data.preparation}}'),
        information = ($4)
      WHERE id = $5
    `

    const values = [
      data.chef_id,
      data.image,
      data.title,
      data.information,
      data.id
    ]

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
  }
}
