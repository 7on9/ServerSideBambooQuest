let crypto = require('crypto')
let User = require('../models/user')
let Utility = require('../common/utility')
let Cloudinary = require('./cloudinary')
const { ERROR } = require('../common/constant/event')

const isExistEmail = async email => {
  try {
    let user = await User.findOne({ email, deleted: false }).exec()
    return user ? true : false
  } catch (error) {
    console.log(error)
    return false
  }
}

const UserController = {
  /**
   * TODO: Register account
   * @param {String} email
   * @param {String} password
   * @param {String} name
   * @param {Function} callback
   */
  register: async (email, password, name) => {
    email = email.toLowerCase()
    let existEmail = await isExistEmail(email)
    if (existEmail) {
      throw new Error(ERROR.DUPLICATE)
    } else {
      password = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex')
      let newUser = new User({
        email,
        name,
        password,
        last_update: Date.now(),
        game_history: [],
        deleted: false,
      })
      try {
        let res = await newUser.save()
        res.password = null
        return res
      } catch (error) {
        throw error
      }
    }
  },
  /**
   * TODO: Login into server
   * @param {String} email
   * @param {String} password
   * @param {Function} callback
   */
  login: async (email, password) => {
    password = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')
    email = email.toLowerCase()
    let _user = await User.findOne({ email, password, deleted: false }).exec()
    if (_user) {
      let token = Utility.getToken(email)
      if (token) {
        return { user: _user, token: token[0] }
      } else {
        token = await Utility.computingJWT(email)
        Utility.addNewTokenForUser(email, token)
        _user.password = null
        return { user: _user, token }
      }
    } else {
      throw new Error(ERROR.UNAUTHORIZED)
    }
  },
  logout: async token => {
    try {
      let user = await Utility.verifyToken(token)
      Utility.removeTokenForUser(user.email)
      return true
    } catch (error) {
      throw error
    }
  },
  getBaseInfo: async _id => {
    let user = await User.findOne({ _id })
      .select('name', 'dob', 'gender', 'organization', 'avatar_path')
      .exec()
    if (user) {
      return user
    } else {
      throw new Error(ERROR.NOT_EXIST)
    }
  },
  getBaseInfoOfAmoutUsers: async limit => {
    try {
      let users = await User.find({})
        .limit(limit || 25)
        .select('name', 'dob', 'gender', 'organization', 'avatar_path')
        .exec()
      return users
    } catch (error) {
      throw error
    }
  },
  update: async user => {
    user.avatar_path = await Cloudinary.upload(user.avatar_path)
    user.password = crypto
      .createHash('sha256')
      .update(user.password)
      .digest('hex')
    try {
      let oldUser = await User.findById(user._id).exec()
      oldUser.dob = user.dob
      oldUser.name = user.name
      oldUser.phone = user.phone
      oldUser.gender = user.gender
      oldUser.password = user.password
      oldUser.avatar_path = user.avatar_path
      oldUser.organization = user.organization
      oldUser.last_update = Date.now()
      let res = await oldUser.save()
      return res
    } catch (error) {
      throw error
    }
  },
  deleteAccount: async token => {
    try {
      let user = await Utility.verifyToken(token)
      let res = await User.find({ _id: user._id }, { $set: { deleted: true } }).exec()
      console.log(res)
      return res ? true : false
    } catch (error) {
      console.log(error)
      return false
    }
  },
}

module.exports = UserController
