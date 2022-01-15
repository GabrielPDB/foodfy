const db = require('../../config/db')
const { hash } = require('bcryptjs')

module.exports = {
  async getAllUsers() {
    try {
      const query = `
        SELECT * FROM users
      `

      let results = await db.query(query)
      return results.rows
    } catch (error) {
      console.error(error)
    }
  },
  async getAllUsersToList() {
    try {
      const query = `
        SELECT id, name, email FROM users
      `

      let results = await db.query(query)
      return results.rows
    } catch (error) {
      console.error(error)
    }
  },
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
  async findById(id) {
    try {
      let query = 'SELECT * FROM users'

      if (id) {
        query = `${query} WHERE id = '${id}'`
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
  },
  async update(user) {
    try {
      const query = `
        UPDATE users SET
          name = '${user.name}',
          email = '${user.email}',
          is_admin = ${user.is_admin}
        WHERE id = ${user.id}
      `
      return await db.query(query)
    } catch (error) {
      console.error(error)
    }
  },
  async updateProfile(user) {
    try {
      const query = `
        UPDATE users SET
          name = '${user.name}',
          email = '${user.email}'
        WHERE id = ${user.id}
      `
      return await db.query(query)
    } catch (error) {
      console.error(error)
    }
  },
  async delete(id) {
    try {
      const query = `
        DELETE FROM users WHERE id = ${id}
      `
      return await db.query(query)
    } catch (error) {
      console.error(error)
    }
  },
  async isAdmin(id) {
    let query = `SELECT is_admin FROM users WHERE id = ${id}`

    let result = (await db.query(query)).rows[0]

    return result.is_admin
  }
}
