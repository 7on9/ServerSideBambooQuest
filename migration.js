const migrate = async () => {
  require('./server')
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
      console.log('=========running migration: ', file)
      let migration = require(`./migration/${file.replace('.js', '')}`)
      await migration()
    } catch (error) {
      console.log('=========run migration fail: ', file)
      console.log('=========error: ', error)
      process.exit(0)
    }
  })
}

migrate()
