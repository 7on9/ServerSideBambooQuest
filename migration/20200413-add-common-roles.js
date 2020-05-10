const migrate = async () => {
  let Role = require('../controllers/role')
  try {
    await Role.create({ name: 'super-admin', roles: [], methods: Role.getAllMethod() })
  } catch (error) {
    console.log(error)
  }
}

module.exports = migrate
