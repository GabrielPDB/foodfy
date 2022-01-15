const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/ProfileController')

const UserValidator = require('../app/validators/UserValidator')

routes.get('/', ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/', UserValidator.putLoggedUser, ProfileController.put) // Editar o usuário logado

module.exports = routes
