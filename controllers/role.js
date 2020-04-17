const Role = require('../models/role')
const controllers = require('../controllers')

const roleController = {
  create: async ({ name, roles, actions }) => {
    let role = new Role({
      name,
      roles,
      actions,
    })
    try {
      let doc = await role.save()
      doc.roles = [...doc.roles, doc._id]
      doc = await doc.save()
      console.log(`============ Created role: ${doc}`)
      if (doc) {
        return doc
      }
    } catch (error) {
      console.log(error)
      throw error
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
