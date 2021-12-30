const express = require('express')
const routes = express.Router()
const multer = require('./app/middlewares/multer')
/* const data = require('../data.json') */
const recipes = require('./app/controllers/recipes')
const chefs = require('./app/controllers/chefs')
const site = require('./app/controllers/site')

/* SITE */

routes.get('/', (req, res) => {
  return res.redirect('/home')
})

routes.get('/home', site.home)
routes.get('/about', site.about)
routes.get('/recipes', site.recipes)
routes.get('/recipes/:id', site.recipeInfo)
routes.get('/chefs', site.chefs)

/* ADMIN */

routes.get('/admin', (req, res) => {
  return res.redirect('/admin/recipes')
})

routes.get('/admin/recipes', recipes.index) // Mostrar a lista de receitas
routes.get('/admin/recipes/create', recipes.create) // Mostrar formulário de nova receita
routes.get('/admin/recipes/:id', recipes.show) // Exibir detalhes de uma receita
routes.get('/admin/recipes/:id/edit', recipes.edit) // Mostrar formulário de edição de receita
routes.post('/admin/recipes', multer.array('photos', 5), recipes.post) // Cadastrar nova receita
routes.put('/admin/recipes', multer.array('photos', 5), recipes.put) // Editar uma receita
routes.delete('/admin/recipes', recipes.delete) // Deletar uma receita

routes.get('/admin/chefs', chefs.index) // Mostrar a lista de chefs
routes.get('/admin/chefs/create', chefs.create) // Mostrar formulário de novo chef
routes.get('/admin/chefs/:id', chefs.show) // Exibir detalhes de um chef
routes.get('/admin/chefs/:id/edit', chefs.edit) // Mostrar formulário de edição de chef
routes.post('/admin/chefs', chefs.post) // Cadastrar novo chef
routes.put('/admin/chefs', chefs.put) // Editar um chef
routes.delete('/admin/chefs', chefs.delete) // Deletar um chef

module.exports = routes
