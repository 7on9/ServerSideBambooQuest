// let crypto = require('crypto');
//key = gameCode; val = idGame
let ERROR = require('./constant/error')
let User = require('../models/user')
let gameCode = 1000
let jwt = require('jsonwebtoken')
let mapCodeGame = new Map()
let mapIdGame = new Map()
let mapToken = new Map()
const { CFS, SECRET } = process.env

module.exports = {
  computingJWT: (email, role) => {
    return new Promise((res, rej) => {
      let payload = {
        email,
        role,
        confess: CFS,
        key: 'your name',
        exp: Date.now() + 43200000 * 30, //exp in 14 days
      }
      let secretKey = SECRET
      jwt.sign(payload, secretKey, { algorithm: 'HS256' }, (error, token) =>
        error ? rej(error) : res(token)
      )
    })
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
  /**
   * TODO: Get user from token
   * @param {string} token
   * @returns {Promise<User>} user
   */
  verifyToken: async token => {
    let decodedToken = await jwt.decode(token, SECRET)
    if (decodedToken) {
      if (decodedToken.exp < Date.now()) {
        mapToken.delete(decodedToken.email)
        throw new Error(ERROR.TOKEN.EXPIRED)
      } else {
        let tokenByEmail = await mapToken.get(decodedToken.email)
        if (tokenByEmail && tokenByEmail.indexOf(token) >= 0) {
          try {
            let user = await User.findOne({ email: decodedToken.email }).exec()
            if (user) {
              return user
            } else {
              throw new Error(ERROR.USER.NOT_EXIST)
            }
          } catch (error) {
            console.log('[Utility][token]', error)
            throw new Error(ERROR.USER.NOT_EXIST)
          }
        } else {
          throw new Error(ERROR.TOKEN.INVALID)
        }
      }
    } else {
      throw new Error(ERROR.TOKEN.INVALID)
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
  endGame: async idGame => {
    try {
      const gameCode = await mapCodeGame.get(idGame.toString())
      console.log(mapIdGame)
      mapIdGame.delete(gameCode.toString())
      mapCodeGame.delete(idGame.toString())
      console.log(mapIdGame)
    } catch (error) {
      console.log(error)
    }
    // mapCodeGame.delete(code);
  },
}
