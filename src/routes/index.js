const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const recipes = require('./recipes')
const chefs = require('./chefs')
const site = require('./site')
const users = require('./users')
const profile = require('./profile')
const session = require('./session')

const { onlyUsers } = require('../app/middlewares/session')

/* SITE */

routes.get('/', (req, res) => {
  return res.redirect('/home')
})

routes.use(site)
routes.use(session)

/* ADMIN */

routes.get('/admin', onlyUsers, (req, res) => {
  return res.redirect('/admin/recipes')
})

routes.use('/admin/recipes', onlyUsers, recipes)
routes.use('/admin/chefs', onlyUsers, chefs)
routes.use('/admin/users', onlyUsers, users)
routes.use('/admin/profile', onlyUsers, profile)

module.exports = routes
