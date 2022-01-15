const express = require('express')
const routes = express.Router()
const multer = require('../app/middlewares/multer')

const ChefController = require('../app/controllers/ChefController')

const { onlyAdmin } = require('../app/middlewares/session')

routes.get('/', ChefController.index) // Mostrar a lista de chefs
routes.get('/create', onlyAdmin, ChefController.create) // Mostrar formulário de novo chef
routes.get('/:id', ChefController.show) // Exibir detalhes de um chef
routes.get('/:id/edit', onlyAdmin, ChefController.edit) // Mostrar formulário de edição de chef
routes.post('/', onlyAdmin, multer.array('photos', 1), ChefController.post) // Cadastrar novo chef
routes.put('/', onlyAdmin, multer.array('photos', 1), ChefController.put) // Editar um chef
routes.delete('/', onlyAdmin, ChefController.delete) // Deletar um chef

module.exports = routes
