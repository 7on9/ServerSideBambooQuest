const migrate = async () => {
  let Quest = require('../models/quest')
  let User = require('../models/user')
  try {
    let quests = await Quest.find({}).exec()
    quests.forEach(async quest => {
      let user = await User.findById(quest._doc ? quest._doc.id_author : quest.id_author).exec()
      quest.author = user._doc ? user._doc.name : user.name
      await quest.save()
      console.log(`========== quest: ${quest._id} - author: ${quest.author}`)
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = migrate
