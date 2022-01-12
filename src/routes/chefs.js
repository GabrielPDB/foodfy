const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ChefController = require('../app/controllers/ChefController')

routes.get('/', ChefController.index) // Mostrar a lista de chefs
routes.get('/create', ChefController.create) // Mostrar formulário de novo chef
routes.get('/:id', ChefController.show) // Exibir detalhes de um chef
routes.get('/:id/edit', ChefController.edit) // Mostrar formulário de edição de chef
routes.post('/', multer.array('photos', 1), ChefController.post) // Cadastrar novo chef
routes.put('/', multer.array('photos', 1), ChefController.put) // Editar um chef
routes.delete('/', ChefController.delete) // Deletar um chef

module.exports = routes
