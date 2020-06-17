let Game = require('../models/game')
let Player = require('../models/player')
let Ans = require('../models/ans')
let Quest = require('../models/quest')
let Question = require('../models/question')
const { error400, error403, error401 } = require('../common/constant/error').CODE
let Utility = require('../common/utility')
let Cloudinary = require('./cloudinary')
const { canExecAction } = require('./role')
let QuestController = {
  /**
   * TODO get quests of user
   * @param {String} idUser
   * @returns {Promise<Array>} quests
   */
  getQuestsOfUser: async idUser => {
    try {
      let quests = await Quest.find({ id_author: idUser }).exec()
      return quests
    } catch (error) {
      console.log(error)
      return []
    }
  },
  /**
   * TODO get quests of user
   * @param {String} idUser
   * @param {String} idQuest
   * @returns {Promise<Object>} quest
   */
  getInfo: async (idUser, idQuest) => {
    try {
      let quest = await Quest.findOne({
        id_author: idUser,
        _id: idQuest,
      }).exec()
      return quest
    } catch (error) {
      console.log(error)
      return null
    }
  },
  /**
   * TODO get quests of user
   * @param {
    {
      description: String, 
      img_path: String, 
      title: String, 
      is_public: Boolean}
    } nQuest
   * @returns {Promise<Array>} quests
   */
  createQuest: async (nQuest, user) => {
    let newQuest = new Quest({
      ...nQuest,
      questions: [],
      id_author: user._id,
      author: user.email,
      deleted: false,
    })
    try {
      let res = await newQuest.save()
      return res
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  editQuest: async (nQuest, user) => {
    try {
      let quest = await Quest.findById(nQuest._id)
      if (user._id.toString() != quest.id_author.toString()) {
        throw error403
      }
      if (nQuest.img_path) {
        nQuest.img_path = await Cloudinary.upload(nQuest.img_path)
      }
      let res = await quest.set({ ...nQuest }).save()
      return res
    } catch (error) {
      throw error
    }
  },
  likeQuest: async (_id, user) => {
    try {
      let quest = await Quest.findOne({ _id: _id })

      const userLiked = quest.like.find(i => i.toString() === user._id.toString())
      if (!userLiked) {
        quest.like.push(user._id)
      } else {
        quest.like = quest.like.filter(i => i.toString() !== user._id.toString())
        if (!quest.like) {
          quest.like = []
        }
      }
      let result = await quest.save()
      return result
    } catch (error) {
      throw error
    }
  },
  addQuestion: async (nQuestion, idUser) => {
    let quest = await Quest.findById(nQuestion._id)
    if (quest.id_author.toString() != idUser) {
      throw error403
    } else {
      try {
        let newQuestion = new Question({
          ...nQuestion,
          _id: quest.questions.length + 1,
          ans: [],
          correct_id: parseInt(nQuestion.correct_id),
          n_correct_answer: 0,
          n_incorrect_answer: 0,
          like: 0,
          deleted: false,
        })
        for (let i = 0; i < nQuestion.ans.length; i++) {
          let newAns = new Ans({
            _id: i,
            content: nQuestion.ans[i],
          })
          newQuestion.ans.push(newAns)
        }
        quest.questions.push(newQuestion)
        let res = await quest.save()
        return res
      } catch (error) {
        throw error
      }
    }
  },
  deleteQuestion: async (question, user) => {
    try {
      let quest = await Quest.findById(question._id)
      if (user._id.toString() != quest.id_author.toString()) {
        throw error403
      }
      quest.questions = quest.questions.filter(q => q._id != question.id)
      // quest.questions[question.id].deleted = true
      // console.log(quest.questions)
      let res = await quest.save()
      return res
    } catch (error) {
      throw error
    }
  },
  //start quest/create game
  startQuest: async (token, idQuest) => {
    let user = await Utility.verifyToken(token)
    if (user) {
      let quest = await Quest.findById(idQuest)
      if (quest && !quest.is_public && quest.id_author !== user._id) {
        throw new Error(error403)
      } else {
        try {
          let newGame = new Game({
            id_quest: quest._id,
            id_host: user._id,
            players: [],
          })
          let game = await newGame.save()
          user.game_history.push(game._id)
          await user.save()
          return game._id
        } catch (error) {
          throw error
        }
      }
    } else {
      throw new Error(error401)
    }
  },
  getGameCode: async (idGame, token) => {
    let user = await Utility.verifyToken(token)
    if (user && user._id == idGame) {
      let code = Utility.getCodeGame(idGame)
      if (code) {
        return code
      } else throw new Error('END_GAME')
    } else {
      throw new Error(error403)
    }
  },
  joinQuest: async (idGame, username, token) => {
    username = username.toLowerCase()
    let game = await Game.findOne({ _id: idGame }).exec()
    if (!game) {
      throw new Error('GAME_NOT_EXIST')
    }
    let existUsername = game.players.find(answer => answer.username == username)
    if (existUsername) {
      throw new Error('DUPLICATE_USERNAME')
    } else {
      let newPlayer = new Player({
        username: username,
        ans: [],
        time: 0,
      })
      game.players.push(newPlayer)
      try {
        await game.save()
        if (token) {
          let user = await Utility.verifyToken(token)
          if (user && user._id.toString() == game.id_host.toString()) {
            return true
          } else {
            user.game_history.push(game._id)
            await user.save()
            return true
          }
        }
      } catch (error) {
        console.log(error)
        throw error
      }
    }
  },
  removePlayer: async (_id, username) => {
    let game = await Game.findOne({ _id }).exec()
    let posUser = game.players.findIndex(
      player => player.username.toLowerCase() == username.toLowerCase()
    )
    game.players = game.players.splice(posUser, 1)
    game.save()
  },
  answer: async (_id, username, idAnswer, time) => {
    let game = await Game.findOne({ _id }).exec()
    let posUser = game.players.findIndex(
      player => player.username.toLowerCase() == username.toLowerCase()
    )
    game.players[posUser].ans.push(idAnswer)
    game.players[posUser].time += time
    let { id_quest } = game
    try {
      await game.save()
      return id_quest
    } catch (error) {
      throw error
    }
  },
  getPointOfUserInGame: async (idGame, username) => {
    let game = await Game.findOne({
      _id: idGame,
      players: { $elemMatch: { username } },
    })
    if (game == null) {
      return -1
    } else {
      let gameOfUser = game.players.find()
    }
  },
  getAllQuestionsOfQuest: async idQuest => {
    try {
      let questions = await Quest.findById(idQuest)
        .select('questions')
        .exec()
      return questions
    } catch (error) {
      throw error
    }
  },
  //get info quests
  getPublicInfoQuest: async (_id, user) => {
    try {
      let quest = await Quest.findOne({ _id, deleted: false }).exec()
      let retQuest = { ...quest._doc }
      if ((!user || retQuest.id_author.toString() != user._id.toString()) && !retQuest.is_public) {
        throw error403
      }
      retQuest.questions = Array.from(quest.questions).map(v => v.toJSON())
      return retQuest
    } catch (error) {
      throw error
    }
  },
  //get quest from idGame
  getQuestFromIdGame: async idGame => {
    let game = await Game.findById(idGame)
    let quest = await Quest.findById(game.id_quest)
    return quest
  },
  //get all quests
  getPublicQuests: async (limit, skip, filter) => {
    try {
      let quests = await Quest.find({
        ...filter,
        is_public: true,
        deleted: false,
      })
        .limit(Math.min(limit, 100))
        .skip(skip)
        .exec()
      let retQuest = []
      quests.forEach(quest => {
        let nQuest = { ...quest._doc }
        nQuest.questions = Array.from(quest.questions).map(v => v.toJSON())
        retQuest.push(nQuest)
      })
      return retQuest
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  deleteQuest: async (token, id) => {
    try {
      let user = await Utility.verifyToken(token)
      let quest = await Quest.findById(id).exec()
      let canExec = await canExecAction(user.role, 'user', 'deleteQuestion', user.role)
      if (canExec || user._id == quest.id_author) {
        let res = await Quest.updateOne({ _id: id }, { deleted: true }).exec()
        return res ? true : false
      }
      return false
    } catch (error) {
      console.log(error)
      return false
    }
  },
}
module.exports = QuestController
