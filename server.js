const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const recipes = require('./data')

server.use(express.static('public'))

server.set('view engine', 'njk')

nunjucks.configure('views', {
  express: server,
  autoescape: false,
  noCache: true
})

server.get('/', (req, res) => {
  const firstSixRecipes = recipes.slice(0, 6)

  return res.render('home', { recipes: firstSixRecipes })
})

server.get('/about', (req, res) => {
  return res.render('about')
})

server.get('/recipes', (req, res) => {
  return res.render('recipes', { recipes })
})

server.get('/recipes/:index', (req, res) => {
  const recipeIndex = req.params.index

  return res.render('info', { recipe: recipes[recipeIndex] })
})

server.listen(4000, () => {
  console.log('Server running on 4000')
})
