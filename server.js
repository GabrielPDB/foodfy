const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const revenues = require('./data')

server.use(express.static('public'))

server.set('view engine', 'njk')

nunjucks.configure('views', {
  express: server,
  autoescape: false,
  noCache: true
})

server.get('/', (req, res) => {
  const firstSixRevenues = revenues.slice(0, 6)

  return res.render('home', { revenues: firstSixRevenues })
})

server.get('/about', (req, res) => {
  return res.render('about')
})

server.get('/revenue', (req, res) => {
  return res.render('revenue', { revenues })
})

server.listen(4000, () => {
  console.log('Server running on 4000')
})
