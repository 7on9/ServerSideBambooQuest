let router = require('express').Router()
let Utility = require('../common/utility')
let { error400, error404, error403 } = require('../common/constant/error').CODE
let Cloudinary = require('../controllers/cloudinary')
let { analytic } = require('../controllers/administrator')
let { canExecAction } = require('../controllers/role')

const thisController = 'administrator'

router
  //getInfo - owner
  .get('/analytic/:collection/:method', async (req, res) => {
    try {
      // Enable when ready
      // let user = await Utility.verifyToken(req.headers.token)
      // if (user && !canExecAction(user._id, thisController, 'analytic', null)) {
      //   res.status(403).json(error403)
      //   return
      // }
      let { filter, limit, skip } = req.query
      filter = filter ? JSON.parse(filter) : null
      let { collection, method } = req.params
      collection = collection.toLowerCase()
      let func = analytic(collection)
      let result = await func[method]({ filter, limit, skip })
      res.status(200).json(result)
    } catch (error) {
      res.status(400).json({ ...error400, errorMessage: error })
    }
  })
module.exports = router
