const Role = require('../models/role')
const controllers = require('.')
const userControllers = require('./user')
const questControllers = require('./quest')

const roleController = {
  permissionDefine: {
    COLLECION_FILTER: {
      quest: {
        is_public: true,
        deleted: false,
      },
      user: {
        deleted: false,
      },
    },
    USER_PUBLIC_INFO: [
      '_id',
      'email',
      'avatar_path',
      'name',
      'dob',
      'gender',
      'deleted',
      'last_update',
      'game_history',
    ],
    QUEST_PUBLIC_INFO: [
      'id_author',
      'title',
      'author',
      'questions',
      'deleted',
      'category',
      'img_path',
      'is_public',
      'like',
    ],
    PLAYER_PUBLIC_INFO: ['username', 'ans', 'time'],
    ROLE_PUBLIC_INFO: ['name', 'roles', 'methods'],
    QUESTION_PUBLIC_INFO: [
      '_id',
      'quiz',
      'ans',
      'correct_id',
      'correct_point',
      'incorrect_point',
      'duration',
      'img_path',
      'category',
      'n_correct_answer',
      'n_incorrect_answer',
      'like',
    ],
  },
  create: async ({ name, roles, methods }) => {
    let role = new Role({
      name,
      roles,
      methods,
    })
    try {
      let _role = await Role.findOne({ name }).exec()
      if (_role) {
        throw new Error('Role name is already exist')
      }
      let doc = await role.save()
      doc.roles = [...doc.roles, doc._id]
      doc = await doc.save()
      console.log(`============ Created role: ${doc}`)
      return doc
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  },
  /**
   * @param {{ name, role, methods }} nRole
   */
  upsert: async nRole => {
    let { name, role, methods } = nRole
    if (!name || !role || !methods) {
      throw Error('require parameter')
    }
    try {
      let _role = await Role.findOne({ name }).exec()
      if (_role) {
        if (role._doc) {
          _role._doc = { ..._role._doc, ...nRole }
        } else {
          _role = { ...role, ...nRole }
        }
      } else {
        let newRole = new Role({
          name,
          role,
          methods,
        })
        let doc = await newRole.save()
        doc.roles = [...doc.roles, doc._id]
        doc = await doc.save()
        console.log(`============ Created role: ${doc}`)
        return doc
      }
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  },
  /**
   * TODO: Get role
   * @param {Object} filter
   */
  get: async filter => {
    try {
      let roles = await Role.find(filter || {})
      return roles
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  /**
   * TODO: Get role
   * @param {String} _id
   */
  getById: async _id => {
    try {
      let role = await Role.findById(_id)
      return role
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  /**
   * TODO: Get role
   * @param {Object} filter
   */
  delete: async id => {
    try {
      let res = await Role.findByIdAndDelete(id).exec()
      return res
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  canExecAction: async (roleId, controller, method, roleTarget) => {
    try {
      let userRole = await Role.findById(roleId)
      if (userRole.name == 'super-admin') {
        return true
      }
      if (
        userRole.methods.find(m => m == `${controller}/${method}`) &&
        (!roleTarget || (roleTarget && userRole.roles.find(r => r == roleTarget)))
      ) {
        return true
      }
      return false
    } catch (error) {
      console.log(error)
      return false
    }
  },
  getAllMethod: () => {
    try {
      let methods = []
      Object.keys(controllers).forEach(controller => {
        let ctrler = controllers[controller]
        Object.keys(ctrler).forEach(method => {
          methods.push(`${controller}/${method}`)
        })
      })
      return methods
    } catch (error) {
      console.log(error)
      return []
    }
  },
  getUserMethod: () => {
    try {
      let methods = []
      let _controllers = {
        quest: controllers.quest,
        user: controllers.user,
      }
      Object.keys(_controllers).forEach(controller => {
        let ctrler = _controllers[controller]
        Object.keys(ctrler).forEach(method => {
          methods.push(`${controller}/${method}`)
        })
      })
      return methods
    } catch (error) {
      console.log(error)
      return []
    }
  },
}

module.exports = roleController
