const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')

routes.get('/', UserController.list) // Mostrar a lista de usuários cadastrados
routes.post('/', UserController.post) // Cadastrar um usuário
routes.get('/create', UserController.create) // Mostrar o formulário de criação de um usuário
routes.put('/:id', UserController.put) // Editar um usuário
routes.get('/:id/edit', UserController.edit) // Mostrar o formulário de edição de um usuário
routes.delete('/:id', UserController.delete) // Deletar um usuário

module.exports = routes
