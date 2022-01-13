const db = require('../../config/db')
const { hash } = require('bcryptjs')

module.exports = {
  async findByEmail(email) {
    try {
      let query = 'SELECT * FROM users'

      if (email) {
        query = `${query} WHERE email = '${email}'`
      } else {
        return false
      }

      const results = await db.query(query)

      return results.rows[0]
    } catch (error) {
      console.error(error)
    }
  },
  async create(user) {
    try {
      const query = `
      INSERT INTO users (
        name,
        email,
        password,
        is_admin
      ) VALUES ($1, $2, $3, $4)
      RETURNING id
      `
      const values = [user.name, user.email, user.password, user.is_admin]

      const results = await db.query(query, values)
      return results.rows[0].id
    } catch (error) {}
  }
}
