let router = require('express').Router()
let user = require('../controllers/user')
let Utility = require('../common/utility')
let { error401 } = require('../common/constant/error').CODE

router
  //verify data before call this api
  .post('/register', async (req, res) => {
    let { email, password, name } = req.body
    if (!email || !password) {
      res.status(400).send({
        result: false,
      })
    } else {
      try {
        await user.register(email, password, name)
        res.status(201).send({ result: true })
      } catch (error) {
        res.status(400).send(error)
      }
    }
  })
  .post('/login', async (req, res) => {
    try {
      let result = await user.login(req.body.email, req.body.password)
      delete result.user.password
      res.status(200).send({
        result: true,
        token: result.token,
        info: result.user,
      })
    } catch (error) {
      console.log(error)
      res.status(401).send(error401)
    }
  })
  .post('/logout', (req, res) => {
    user.logout(req.headers.token, (error, result) => {
      if (error || !result) {
        res.status(404).send({
          result: false,
        })
      } else {
        res.status(200).send({
          result: true,
        })
      }
    })
  })
  .post('/verify', async (req, res) => {
    if (req.headers.token) {
      Utility.verifyToken(req.headers.token, (err, user) => {
        if (err) {
          res.status(401).send({
            result: false,
          })
          return
        }
        user = user._doc
        if (user) {
          delete user.password
          res.status(201).json({
            result: true,
            token: req.headers.token,
            info: user,
          })
        }
      })
    }
  })
  .get('/info', async (req, res) => {
    let verifyToken = await Utility.verifyToken(req.headers.token)
    if (verifyToken) {
      res.status(200).json({
        result: false,
        detail: verifyToken,
      })
    } else {
      res.status(401).send({
        result: false,
        detail: 'UNAUTHORIZED',
      })
    }
  })
  .post('/info', async (req, res) => {
    let verifyToken = await Utility.verifyToken(req.headers.token)
    if (verifyToken) {
      user.update(req.body, (err, updated) => {
        if (err) {
          res.status(401).json({
            result: false,
            detail: 'QUERY_ERROR',
          })
        } else {
          res.status(200).json({
            result: true,
            detail: 'UPDATED',
          })
        }
      })
    } else {
      res.status(401).send({
        result: false,
        detail: 'UNAUTHORIZED',
      })
    }
  })
  .delete('/delete', (req, res) => {
    user.deleteAccount(req.headers.token, (error, result) => {
      if (error) {
        res.status(401).json({
          result: false,
          detail: 'UNAUTHORIZED',
        })
      } else {
        res.status(200).json({
          result: true,
          detail: 'Deleted',
        })
      }
    })
  })

module.exports = router
