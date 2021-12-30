const Chef = require('../models/Chef')
const Recipe = require('../models/Recipe')
const { date } = require('../../lib/utils')

exports.home = async (req, res) => {
  const recipes = (await Recipe.all()).rows

  return res.render('site/home', { recipes })
}

exports.about = async (req, res) => {
  return res.render('site/about')
}

exports.recipes = async (req, res) => {
  const { search } = req.query
  let recipes = ''

  if (search == '' || !search) {
    recipes = (await Recipe.all()).rows
    return res.render('site/recipes', { recipes, search })
  } else {
    recipes = (await Recipe.findBy(search)).rows
    return res.render('site/recipes', { recipes, search })
  }
}

exports.recipeInfo = async (req, res) => {
  const { id } = req.params

  const recipe = (await Recipe.find(id)).rows[0]
  return res.render('site/info', { recipe })
}

exports.chefs = async (req, res) => {
  const chefs = (await Chef.all()).rows
  return res.render('site/chefs', { chefs })
}
