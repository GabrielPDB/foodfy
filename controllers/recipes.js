const fs = require('fs')
const data = require('../data.js')

exports.index = (req, res) => {
  return res.send('index')
}

exports.create = (req, res) => {
  return res.send('create')
}

exports.show = (req, res) => {
  return res.send('show')
}

exports.edit = (req, res) => {
  return res.send('edit')
}

exports.post = (req, res) => {
  return res.send('post')
}

exports.put = (req, res) => {
  return res.send('put')
}

exports.delete = (req, res) => {
  return res.send('delete')
}
