const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/UserController')
const UserValidator = require('../app/validators/UserValidator')

const { onlyAdmin, onlyUsers } = require('../app/middlewares/session')

routes.get('/', onlyUsers, UserController.list) // Mostrar a lista de usuários cadastrados
routes.post('/', onlyAdmin, UserValidator.post, UserController.post) // Cadastrar um usuário
routes.get('/create', onlyAdmin, UserController.create) // Mostrar o formulário de criação de um usuário
routes.put('/:id', onlyAdmin, UserValidator.put, UserController.put) // Editar um usuário
routes.get('/:id/edit', onlyAdmin, UserController.edit) // Mostrar o formulário de edição de um usuário
routes.delete('/:id', onlyAdmin, UserController.delete) // Deletar um usuário

module.exports = routes
