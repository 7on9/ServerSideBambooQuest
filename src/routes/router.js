let express = require('express')

let user = require('./user')
let quest = require('./quest')
let category = require('./category')
let administrator = require('./administrator')

let routes = express.Router()

routes.use('/user', user)
routes.use('/quest', quest)
routes.use('/category', category)
routes.use('/admin', administrator)

module.exports = routes
