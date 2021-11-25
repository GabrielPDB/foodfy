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
  Recipe.all(recipes => {
    return res.render('site/recipes', { recipes })
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
