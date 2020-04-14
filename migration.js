const migrate = async () => {
  //mongoDb
  require('./common/connection')
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
      let migration = require(file)
      await migration()
    } catch (error) {
      console.log('=========run migration fail: ', file)
      process.exit(0)
    }
  })
}

migrate()
