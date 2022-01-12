const express = require('express')
const routes = express.Router()

const SiteController = require('../app/controllers/SiteController')

routes.get('/home', SiteController.home)
routes.get('/about', SiteController.about)
routes.get('/recipes', SiteController.recipes)
routes.get('/recipes/:id', SiteController.recipeInfo)
routes.get('/chefs', SiteController.chefs)

module.exports = routes
