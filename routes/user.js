let router = require('express').Router()
let user = require('../controllers/user')
let Utility = require('../common/utility')

router
  //verify data before call this api
  .post('/register', (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      res.status(400).send({
        result: false,
      })
    } else {
      user.register(req.body.email, req.body.password, req.body.name, (error, result) => {
        if (error) {
          res.status(400).send({
            result: false,
            detail: error,
          })
        } else {
          res.status(201).send({
            result: true,
          })
        }
      })
    }
  })
  .post('/login', (req, res, next) => {
    user.login(req.body.email, req.body.password, (error, result) => {
      if (error || !result) {
        res.status(401).send({
          result: false,
        })
      } else {
        // user.updateToken(req.body.email, req.body.password, result);
        delete result.user.password
        res.status(200).send({
          result: true,
          token: result.token,
          info: result.user,
        })
      }
    })
  })
  .post('/logout', (req, res, next) => {
    user.logout(req.headers.token, (error, result) => {
      // console.log(error +  " "+result);
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
  .post('/verify', async (req, res, next) => {
    if (req.headers.token) {
      Utility.verifyToken(req.headers.token, (err, user) => {
        user = user._doc
        if (user) {
          delete user.password
          res.status(201).json({
            result: true,
            token: req.headers.token,
            info: user,
          })
        } else {
          res.status(401).send({
            result: false,
          })
        }
      })
    }
  })
  .get('/info', async (req, res, next) => {
    let verifyToken = await Utility.verifyToken(req.headers.token)
    if (verifyToken) {
      res.status(200).json({
        result: false,
        detail: verifyToken,
      })
    } else {
      res.status(401).send({
        result: false,
        detail: 'UnAuthorized',
      })
    }
  })
  .post('/info', async (req, res, next) => {
    let verifyToken = await Utility.verifyToken(req.headers.token)
    if (verifyToken) {
      user.update(req.body, (err, updated) => {
        if (err) {
          res.status(401).json({
            result: false,
            detail: 'query error',
          })
        } else {
          res.status(200).json({
            result: true,
            detail: 'Updated',
          })
        }
      })
    } else {
      res.status(401).send({
        result: false,
        detail: 'UnAuthorized',
      })
    }
  })
  .delete('/delete', (req, res, next) => {
    user.deleteAccount(req.headers.token, (error, result) => {
      if (error) {
        res.status(401).json({
          result: false,
          detail: 'UnAuthorized',
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
