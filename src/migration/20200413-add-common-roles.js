const migrate = async () => {
  let Role = require('../controllers/role')
  let roles = [
    { name: 'super-admin', roles: [], methods: Role.getAllMethod() },
    { name: 'user', roles: [], methods: Role.getUserMethod() },
  ]
  try {
    roles.forEach(role => Role.upsert(role))
  } catch (error) {
    console.log(error)
  }
}

module.exports = migrate
