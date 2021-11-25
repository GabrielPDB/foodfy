const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const { date } = require('../../lib/utils')

exports.home = (req, res) => {
  Recipe.all(recipes => {
    return res.render('site/home', { recipes })
  })
}

exports.about = (req, res) => {
  return res.render('site/about')
}

exports.recipes = (req, res) => {
  const { search } = req.query

  if (search == '' || !search) {
    Recipe.all(recipes => {
      return res.render('site/recipes', { recipes, search })
    })
  } else
    Recipe.findBy(search, recipes => {
      return res.render('site/recipes', { recipes, search })
    })
}

exports.recipeInfo = (req, res) => {
  const { id } = req.params

  Recipe.find(id, recipe => {
    return res.render('site/info', { recipe })
  })
}

exports.chefs = (req, res) => {
  Chef.all(chefs => {
    return res.render('site/chefs', { chefs })
  })
}
