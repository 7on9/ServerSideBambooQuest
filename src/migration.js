require('./server')
const migrate = async () => {
  let Migrate = require('./controllers/migration')
  //mongoDb
  // require('./common/connection')
  //requiring path and fs modules
  const path = require('path')
  const fs = require('fs')
  //joining path of directory
  const directoryPath = path.join(__dirname, './migration/')
  //passsing directoryPath and callback function
  let files = fs.readdirSync(directoryPath)
  //listing all files using forEach
  files.forEach(async file => {
    // Do whatever you want to do with the file
    try {
      let migration = require(`./migration/${file.replace('.js', '')}`)
      let isDone = await Migrate.isDone(file.replace('.js', ''))
      if (isDone) {
        console.log('=========skiped migration: ', file)
        return
      } else {
        console.log('=========running migration: ', file)
        await migration()
        await Migrate.create(file.replace('.js', ''))
      }
    } catch (error) {
      console.log('=========run migration fail: ', file)
      console.log('=========error: ', error)
      process.exit(0)
    }
  })
}
setTimeout(() => {
  migrate()
}, 3000)
