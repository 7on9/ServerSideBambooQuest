let Migration = require('../models/migration')

const MigrationController = {
  isDone: async migration => {
    try {
      let _migration = await Migration.findOne({ name: migration }).exec()
      if (_migration) {
        return true
      } else {
        return false
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  create: async migration => {
    try {
      let _migration = new Migration({ name: migration })
      await _migration.save()
      console.log('========== Inserted migration: ', migration)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}

module.exports = MigrationController
