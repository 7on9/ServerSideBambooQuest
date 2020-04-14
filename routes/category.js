let router = require('express').Router()
let { get, update, create, addQuestion } = require('../controllers/category')
let Utility = require('../common/utility')
let { canExecAction } = require('../controllers/role')
let { error400, error404, error401, error403 } = require('../common/constant/error').CODE
let Cloudinary = require('../controllers/cloudinary')

router
  .get('/', async (req, res) => {
    try {
      let { filter } = req.params
      let categories = await get(filter)
      res.status(200).json(categories)
    } catch (error) {
      res.status(400).json({ ...error400, errorMessage: error })
    }
  })
  .post('/', async (req, res) => {
    try {
      let newCategory = JSON.parse(req.body.newCategory)
      let user = await Utility.verifyToken(req.headers.token)
      if (user && !canExecAction) {
        res.status(403).json(error403)
        return
      }
      if (newCategory.name && newCategory.description && newCategory.img_path) {
        newCategory.img_path = await Cloudinary.upload(newCategory.img_path)
        let result = await create(newCategory)
        res.status(200).json(result)
      } else {
        res.status(400).json(error400)
      }
    } catch (error) {
      res.status(400).json(error400)
    }
  })
  .put('/:id', async (req, res) => {
    try {
      let category = JSON.parse(req.body.category)
      let user = await Utility.verifyToken(req.headers.token)
      if (user && !canExecAction) {
        res.status(403).json(error403)
        return
      }
      if (category._id && category.img_path) {
        category.img_path = await Cloudinary.upload(category.img_path)
        let result = await update(category)
        res.status(200).json(result)
      } else {
        res.status(400).json(error400)
      }
    } catch (error) {
      res.status(400).json(error400)
    }
  })
module.exports = router
