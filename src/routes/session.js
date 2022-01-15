const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const UserValidator = require('../app/validators/UserValidator')

const SessionController = require('../app/controllers/SessionController')
/* const SessionValidator = require('../app/validators/SessionValidator') */

routes.get('/login', SessionController.login)

module.exports = routes
