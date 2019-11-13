// let crypto = require('crypto');
//key = gameCode; val = idGame
let ERROR = require('./constant/error')
let KEY = require('../common/constant/key')
let User = require('../models/user')
let gameCode = 1000
let jwt = require('jsonwebtoken')
let mapCodeGame = new Map()
let mapIdGame = new Map()
let mapToken = new Map()

module.exports = {
  computingJWT: (email, callback) => {
    let payload = {
      email: email,
      confess: KEY.CONFESS,
      key: 'your name (full)',
      exp: Date.now() + 43200000,
    }
    //exp in 12h
    let secretKey = KEY.SECRET
    jwt.sign(payload, secretKey, { algorithm: 'HS256' }, callback)
  },
  getToken: email => {
    return mapToken.get(email)
  },
  addNewTokenForUser: (email, token) => {
    let arrToken = mapToken.get(email)
    if (!arrToken) {
      arrToken = []
    }
    arrToken.push(token)
    mapToken.set(email, arrToken)
    // mapToken.set(email, token);
  },
  removeTokenForUser: email => {
    mapToken.delete(email)
  },
  verifyToken: async (token, callback) => {
    let decodedToken = await jwt.decode(token, KEY.SECRET)
    if (decodedToken) {
      if (decodedToken.exp < Date.now()) {
        mapToken.delete(decodedToken.email)
        return callback(new Error(ERROR.TOKEN.EXPIRED), null)
      } else {
        let tokenByEmail = await mapToken.get(decodedToken.email)
        if (tokenByEmail && tokenByEmail.indexOf(token) >= 0) {
          User.findOne({ email: decodedToken.email }, (err, user) => {
            if (err) {
              return callback(new Error(ERROR.USER.NOT_EXIST), null)
            } else {
              if (user) {
                return callback(null, user)
              }
            }
          })
        } else {
          return callback(new Error(ERROR.TOKEN.INVALID), null)
        }
      }
    } else {
      return callback(new Error(ERROR.TOKEN.INVALID), null)
    }
  },
  createGameCode: idGame => {
    mapIdGame.set((++gameCode).toString(), idGame.toString())
    mapCodeGame.set(idGame.toString(), gameCode.toString())
    return gameCode
  },
  getIdGame: code => {
    return mapIdGame.get(code.toString())
  },
  getCodeGame: idGame => {
    return mapCodeGame.get(idGame.toString())
  },
  endGame: code => {
    let idGame = mapIdGame.get(code)
    mapIdGame.delete(code)
    mapCodeGame.delete(idGame)
    // mapCodeGame.delete(code);
  },
}
