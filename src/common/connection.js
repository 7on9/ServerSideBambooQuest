let dbConstants = require('./constant/database')
const mongoose = require('mongoose')

class Database {
  constructor() {
    this._connect()
  }
  async _connect() {
    try {
      let time = 0
      let writeInterval = setInterval(() => {
        process.stdout.write(
          `[============Connecting to the mongodb server (${time++}s)============]\r`
        )
      }, 1000)
      await mongoose.connect(dbConstants.MONGODB_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      clearInterval(writeInterval)
      console.log('[===============Database connection successful===============]')
    } catch (error) {
      console.error('[===============Database connection error===============]\n' + error)
      process.exit(0)
    }
  }
}

module.exports = new Database()
