let crypto = require('crypto')
let User = require('../models/user')
let Role = require('../models/role')
let Utility = require('../common/utility')
let Cloudinary = require('./cloudinary')
let RoleController = require('../controllers/role')
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
   * @param {String} role
   */
  register: async (email, password, name, role) => {
    email = email.toLowerCase()
    role = await Role.find(role ? { _id: role } : { name: 'user' }).select('_id')
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
        avatar_path: '',
        phone: '',
        last_update: Date.now(),
        game_history: [],
        role,
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
        token = await Utility.computingJWT(email, _user.role)
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
      .select('_id', 'email', 'name', 'dob', 'gender', 'avatar_path')
      .exec()
    if (user) {
      return user
    } else {
      throw new Error(ERROR.NOT_EXIST)
    }
  },
  update: async user => {
    user.avatar_path = user.avatar_path ? await Cloudinary.upload(user.avatar_path) : null
    try {
      let oldUser = await User.findById(user._id).exec()
      oldUser.dob = user.dob
      oldUser.name = user.name
      oldUser.phone = user.phone
      oldUser.gender = user.gender
      oldUser.avatar_path = user.avatar_path ? user.avatar_path : oldUser.avatar_path
      oldUser.organization = user.organization
      oldUser.last_update = Date.now()
      let res = await oldUser.save()
      return res
    } catch (error) {
      throw error
    }
  },
  updatePass: async (_id, oldPassword, password) => {
    try {
      oldPassword = crypto
        .createHash('sha256')
        .update(oldPassword)
        .digest('hex')
      let oldUser = await User.findById(_id).exec()
      if (oldPassword != oldUser.password) {
        throw new Error("Old password doesn't match")
      }
      password = crypto
        .createHash('sha256')
        .update(password)
        .digest('hex')
      oldUser.password = password
      oldUser.last_update = Date.now()
      let res = await oldUser.save()
      return res
    } catch (error) {
      throw error
    }
  },
  setRole: async (role, idUser, roleId) => {
    RoleController.canExecAction(role, 'user', 'setRole', roleId)
    try {
      let oldUser = await User.findById(idUser).exec()
      oldUser.role = roleId
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
