let constant = {
  DATABASE: {
    NAME: "bamboo_quest",
    URL: {
      DEV: "mongodb://127.0.0.1:27017/bamboo_quest",
      RELEASE: "mongodb+srv://7on9:<conchimchichchoe1231>@bambooquest-esrpd.mongodb.net/test?retryWrites=true"
    },
    COLLECTION: {
      USER: "user",
      GAME: "game",
      QUEST: "quest"
    }
  }
}
module.exports = constant;