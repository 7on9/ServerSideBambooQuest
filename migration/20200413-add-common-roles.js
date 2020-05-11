const migrate = async () => {
  let Role = require('../controllers/role')
  let roles = [
    { name: 'super-admin', roles: [], methods: Role.getAllMethod() },
    { name: 'user', roles: [], methods: Role.getUserMethod() },
  ]
  try {
    await Role.upsert({ name: 'super-admin', roles: [], methods: Role.getAllMethod() })
  } catch (error) {
    console.log(error)
  }
}

module.exports = migrate
