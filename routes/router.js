let express = require('express')

let user = require('./user')
let quest = require('./quest')

let routes = express.Router()
routes.use('/user', user)
routes.use('/quest', quest)

module.exports = routes
