const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const recipes = require('./recipes')
const chefs = require('./chefs')
const site = require('./site')
const users = require('./users')
const profile = require('./profile')

/* SITE */

routes.get('/', (req, res) => {
  return res.redirect('/home')
})

routes.use(site)

/* ADMIN */

routes.get('/admin', (req, res) => {
  return res.redirect('/admin/recipes')
})

routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)
routes.use('/admin/users', users)
routes.use('/admin/profile', profile)

module.exports = routes
