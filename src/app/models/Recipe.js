const db = require('../../config/db')
const { date } = require('../../lib/utils')

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM recipes`, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    })
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
    db.query(`SELECT * FROM recipes WHERE id = $1`, [id], (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows[0])
    })
  },
  getChefsToSelectOptions(callback) {
    db.query(`SELECT * FROM chefs`, (err, results) => {
      if (err) throw `Database error! ${err}`

      callback(results.rows)
    })
  }
}
