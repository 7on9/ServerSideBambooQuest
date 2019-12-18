let Game = require('../models/game')
let Player = require('../models/player')
let Ans = require('../models/ans')
let Quest = require('../models/quest')
let Question = require('../models/question')
let constant = require('../common/constant/event')

let Utility = require('../common/utility')

let quest = {
  getQuestsOfUser: (idUser, callback) => {
    Quest.find({ _id_author: idUser }, callback)
  },
  getInfo: (idUser, idQuest, callback) => {
    Quest.findOne({ _id_author: idUser, _id: idQuest }, callback)
  },
  createQuest: (nQuest, user, callback) => {
    let newQuest = new Quest({
      _id_author: user._id,
      title: nQuest.title,
      questions: [],
      description: nQuest.description,
      isPublic: nQuest.isPublic,
      img_path: nQuest.img_path,
      deleted: false,
    })
    newQuest
      .save()
      .then(res => callback(null, res))
      .catch(err => callback(err, null))
  },
  editQuest: (nQuest, user, callback) => {},
  addQuestion: (nQuestion, idUser, callback) => {
    Quest.findById(nQuestion._id, (err, fQuest) => {
      if (fQuest._id_author.toString() != idUser) {
        callback(true, null)
      } else {
        let newQuestion = new Question({
          _id: fQuest.questions.length + 1,
          quiz: nQuestion.quiz,
          ans: [],
          correct_id: parseInt(nQuestion.correct_id),
          correct_point: nQuestion.correct_point,
          incorrect_point: nQuestion.incorrect_point,
          duration: nQuestion.duration,
          img_path: nQuestion.img_path,
          category: nQuestion.category,
          nCorrectAnswer: 0,
          nIncorrectAnswer: 0,
          like: 0,
          deleted: false,
        })
        for (let i = 0; i < nQuestion.ans.length; i++) {
          let newAns = new Ans({
            _id: i + 1,
            content: nQuestion.ans[i],
          })
          newQuestion.ans.push(newAns)
        }
        fQuest.questions.push(newQuestion)
        fQuest
          .save()
          .then(res => callback(null, res))
          .catch(err => callback(err, null))
      }
    })
  },
  //start quest/create game
  startQuest: async (token, idQuest, callback) => {
    Utility.verifyToken(token, (err, user) => {
      if (user) {
        Quest.findById(idQuest, (err, quest) => {
          if (quest && !quest.isPublic && quest._id_author !== user._id) {
            return callback(new Error("DON'T HAVE PERMISSION"), null)
          } else {
            let newGame = new Game({
              id_quest: quest._id,
              id_host: user._id,
              players: [],
            })
            newGame
              .save()
              .then(game => {
                user.gameHistory.push(game._id)
                user
                  .save()
                  .catch(err => console.log(err))
                  .then(() => callback(null, game._id))
              })
              .catch(err => callback(err, null))
          }
        })
      } else {
        callback(new Error('UNAUTHORIZE'), null)
      }
    })
  },
  getGameCode: async (idGame, token, callback) => {
    Utility.verifyToken(token, (err, user) => {
      if (user._id == idGame) {
        let code = Utility.getCodeGame(idGame)
        if (code) return callback(null, code)
        else return callback(new Error('END_GAME'), null)
      } else {
        return callback(new Error("DON'T HAVE PERMISTION"), null)
      }
    })
  },
  //idGame = idGame
  joinQuest: async (idGame, username, token, callback) => {
    username = username.toLowerCase()
    let game = await Game.findOne({ _id: idGame })
    if (!game) {
      return callback(new Error('GAME_NOT_EXIST'), null)
    }
    let existUsername = game.players.find(answer => answer.username == username)
    if (existUsername) {
      callback(new Error('DUPLICATE_USERNAME'), null)
    } else {
      let newPlayer = new Player({
        username: username,
        ans: [],
        time: 0,
      })
      game.players.push(newPlayer)
      game
        .save()
        .then(async () => {
          if (game && token) {
            Utility.verifyToken(token, (err, user) => {
              if (user) {
                if (user._id.toString() == game.id_host.toString()) {
                  return callback(null, true)
                } else {
                  user.gameHistory.push(game._id)
                  user.save().then(() => callback(null, true))
                }
              }
            })
          } else {
            return callback(null, true)
          }
        })
        .catch(err => callback(err, null))
    }
  },
  removePlayer: async (idGame, username) => {
    let game = await Game.findOne({ _id: idGame })
    let posUser = game.players.findIndex(
      player => player.username.toLowerCase() == username.toLowerCase()
    )
    game.players = game.players.splice(posUser, 1)
    game.save()
  },
  answer: async (idGame, username, idAnswer, time, callback) => {
    let game = await Game.findOne({ _id: idGame })
    let posUser = game.players.findIndex(
      player => player.username.toLowerCase() == username.toLowerCase()
    )
    game.players[posUser].ans.push(idAnswer)
    game.players[posUser].time += time
    let id_quest = game.id_quest
    game
      .save()
      .then(() => callback(null, id_quest))
      .catch(err => callback(err, null))
  },
  getPointOfUserInGame: (idGame, username) => {
    return new Promise(async (res, rej) => {
      let game = await Game.findOne({
        _id: idGame,
        players: { $elemMatch: { username: username } },
      })
      if (game == null) return -1
      else {
        let gameOfUser = game.players.find()
      }
    })
  },
  getAllQuestionsOfQuest: idQuest => {
    return new Promise(async (res, rej) => {
      let query = Quest.findById(idQuest).select('questions')
      query.exec((err, questions) => {
        if (!err) res(questions)
        else rej(err)
      })
    })
  },
  //get info quests
  getPublicInfoQuest: idQuest => {
    return new Promise(async (res, rej) => {
      Quest.findOne({ _id: idQuest, isPublic: true, deleted: false }, (err, quest) => {
        if (err) {
          rej(err)
        } else {
          let retQuest = {}
          retQuest._id_author = quest._id_author
          retQuest._id = quest._id
          retQuest.title = quest.title
          retQuest.img_path = quest.img_path
          retQuest.questions = Array.from(quest.questions).map(v => v.toJSON())
          retQuest.description = quest.description
          retQuest.isPublic = quest.isPublic
          res(retQuest)
        }
      })
    })
  },
  //get quest from idGame
  getQuestFromIdGame: async idGame => {
    let game = await Game.findById(idGame)
    let quest = await Quest.findById(game.id_quest)
    return quest
  },
  //get all quests
  getPublicQuests: limit => {
    return new Promise(async (res, rej) => {
      Quest.find({ isPublic: true, deleted: false })
        .limit(limit || 25)
        .skip(limit * 25)
        .exec((err, quests) => {
          if (err) {
            rej(err)
          } else {
            let retQuest = []
            quests.forEach(quest => {
              let nQuest = {}
              nQuest._id = quest._id
              nQuest.title = quest.title
              nQuest._id_author = quest._id_author
              nQuest.img_path = quest.img_path
              nQuest.questions = Array.from(quest.questions).map(v => v.toJSON())
              nQuest.description = quest.description
              nQuest.isPublic = quest.isPublic
              retQuest.push(nQuest)
            })
            res(retQuest)
          }
        })
    })
  },
}
module.exports = quest
