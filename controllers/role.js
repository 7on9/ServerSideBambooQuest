const Role = require('../models/role')
const controllers = require('../controllers')

const roleController = {
  permissionDefine: {
    COLLECION_FILTER: {
      quest: {
        is_public: false,
        deleted: false,
      },
      user: {
        deleted: false,
      },
    },
    USER_PUBLIC_INFO: ['_id', 'email', 'avatar_path', 'name', 'dob', 'gender'],
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
      if (doc) {
        return doc
      }
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  },
  /**
   * @param {Object} filter
   */
  get: async filter => {
    try {
      let roles = await Role.find(filter || {})
      return roles
    } catch (error) {
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
}

module.exports = roleController
