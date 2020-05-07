let router = require('express').Router()
let { register, login, logout, update, updatePass, deleteAccount } = require('../controllers/user')
let Utility = require('../common/utility')
let { error401, error400 } = require('../common/constant/error').CODE

router
  //verify data before call this api
  .post('/register', async (req, res) => {
    let { email, password, name, role } = req.body
    if (!email || !password) {
      res.status(400).json({
        ...error400,
        errorMessage: 'Missing params',
      })
    } else {
      try {
        await register(email, password, name, role)
        res.status(201).json({ result: true })
      } catch (error) {
        res.status(400).json(error)
      }
    }
  })
  .post('/login', async (req, res) => {
    try {
      let user = await login(req.body.email, req.body.password)
      res.status(200).json({
        token: user.token,
        info: user.user,
      })
    } catch (error) {
      console.log(error)
      res.status(401).send(error401)
    }
  })
  .post('/logout', async (req, res) => {
    try {
      await logout(req.headers.token)
      res.status(200)
    } catch (error) {
      res.status(404).json({
        errorMessage: error,
      })
    }
  })
  .post('/verify', async (req, res) => {
    try {
      let user = await Utility.verifyToken(req.headers.token)
      res.status(201).json({
        token: req.headers.token,
        info: user,
      })
    } catch (error) {
      res.status(401).json({ ...error401, statusMessage: error })
    }
  })
  .get('/info', async (req, res) => {
    let user = await Utility.verifyToken(req.headers.token)
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(401).json(error401)
    }
  })
  //update info
  .post('/info', async (req, res) => {
    let user = await Utility.verifyToken(req.headers.token)
    if (user) {
      try {
        let _user = await update(user._id, req.body.user)
        res.status(200).json(_user)
      } catch (error) {
        res.status(400).json(error)
      }
    } else {
      res.status(401).json(error401)
    }
  })
  //update
  .post('/update-password', async (req, res) => {
    let user = await Utility.verifyToken(req.headers.token)
    if (user) {
      try {
        let result = await updatePass(user._id, req.body.oldPassword, req.body.password)
        res.status(200).json(result)
      } catch (error) {
        res.status(400).json(error)
      }
    } else {
      res.status(401).json(error401)
    }
  })
  .delete('/delete', async (req, res) => {
    try {
      await deleteAccount(req.headers.token)
      res.status(200).json({ result: true })
    } catch (error) {
      console.log(error)
      res.status(400).json({
        ...error400,
        errorMessage: error,
      })
    }
  })

module.exports = router
