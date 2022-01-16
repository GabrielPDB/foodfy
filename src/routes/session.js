const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const SessionValidator = require('../app/validators/SessionValidator')

const { isLoggedRedirectToUsers } = require('../app/middlewares/session')

/* LOGIN / LOGOUT */
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.get('/logout', SessionController.logout)

/* FORGOT / RESET */
routes.get('/forgot', SessionController.forgotForm)
routes.post('/forgot', SessionValidator.forgot, SessionController.forgot)
routes.get('/reset', SessionController.resetForm)
routes.post('/reset', SessionValidator.reset, SessionController.reset)

module.exports = routes
