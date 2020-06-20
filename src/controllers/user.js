const crypto = require('crypto')
const User = require('../models/user')
const Role = require('../models/role')
const Utility = require('../common/utility')
const Cloudinary = require('./cloudinary')
const RoleController = require('./role')
const { ERROR } = require('../common/constant/event')
const { canExecAction } = require('./role')

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
  register: async (email, password, name, role, user) => {
    email = email.toLowerCase()
    var roleCreator = ''
    if (user) {
      roleCreator = await Role.findById(user.role).exec()
      roleCreator = roleCreator.name
    }
    role = await Role.findOne(
      role && roleCreator === 'super-admin' ? { _id: role } : { name: 'user' }
    )
      .select('_id')
      .exec()
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
  update: async (_id, user) => {
    try {
      if (user.avatar_path) {
        user.avatar_path = await Cloudinary.upload(user.avatar_path)
      }
      let oldUser = await User.findById(_id).exec()
      if (user.password && user.oldPassword) {
        user.oldPassword = crypto
          .createHash('sha256')
          .update(user.oldPassword)
          .digest('hex')
        if (user.oldPassword != oldUser.password) {
          throw new Error("Old password doesn't match")
        }
        user.password = crypto
          .createHash('sha256')
          .update(user.password)
          .digest('hex')
      }
      let res = await oldUser.set({ ...user, last_update: Date.now() }).save()
      if (res.password) {
        res.password = null
      } else {
        res._doc.password = null
      }
      return res
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  setRole: async (role, idUser, roleId) => {
    // RoleController.canExecAction(role, 'user', 'setRole', roleId)
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
  deleteAccount: async (token, id) => {
    try {
      let user = await Utility.verifyToken(token)
      let canExec = await canExecAction(user.role, 'user', 'deleteAccount', user.role)
      if (canExec || user._id == id) {
        let res = await User.updateOne({ _id: id }, { deleted: true }).exec()
        return res ? true : false
      }
      return false
    } catch (error) {
      console.log(error)
      return false
    }
  },
}

module.exports = UserController
