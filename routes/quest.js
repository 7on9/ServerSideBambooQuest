let router = require('express').Router()
let quest = require('../controllers/quest')
let Utility = require('../common/utility')
let { error400, error404, error401 } = require('../common/constant/error').CODE
let Cloudinary = require('../controllers/cloudinary')

router
  //getInfo - owner
  .get('/my-quests', async (req, res) => {
    try {
      let user = await Utility.verifyToken(req.headers.token)
      if (user) {
        let myQuests = await quest.getQuestsOfUser(user._id)
        res.status(200).json({ myQuests })
      }
    } catch (error) {
      res.status(401).send(error401)
    }
  })
  // Get all quests of account
  .get('/quest/:id', async (req, res) => {
    let { _id } = req.headers
    if (!_id) {
      res.status(404).send({
        ...error404,
        statusMessage: 'Missing parameter _id',
      })
    }
    try {
      let user = await Utility.verifyToken(req.headers.token)
      if (user) {
        let q = await quest.getInfo(user._id, req.params.id)
        res.status(200).json({ quest: q })
      } else {
        res.status(401).json(error401)
      }
    } catch (error) {
      res.status(400).json(error)
    }
  })
  // Get all questions of quest with id
  .get('/:id/questions', async (req, res) => {
    try {
      let questions = await quest.getAllQuestionsOfQuest(req.params.id)
      res.status(200).json(questions)
    } catch (error) {
      res.status(400).json(error)
    }
  })
  .get('/:id', async (req, res) => {
    try {
      let infoQuest = await quest.getPublicInfoQuest(req.params.id)
      res.status(200).json({ quest: infoQuest })
    } catch (error) {
      res.status(400).json(error)
    }
  })
  // get all quest
  .get('/', async (req, res) => {
    try {
      let { limit } = req.params
      let quests = await quest.getPublicQuests(limit)
      res.status(200).json({
        result: true,
        quests,
      })
    } catch (error) {
      res.status(400).send({
        ...error400,
        statusMessage: error,
      })
    }
  })
  //create quest
  .post('/', async (req, res) => {
    try {
      let newQuest = JSON.parse(req.body.newQuest)
      let user = await Utility.verifyToken(req.headers.token)
      if (!user) {
        res.status(401).send(error401)
      }
      if (newQuest.title && newQuest.description && newQuest.is_public != null) {
        let url = await Cloudinary.upload(newQuest.img_path)
        newQuest.img_path = url
        let result = await quest.createQuest(newQuest, user)
        res.status(400).send(result)
      } else {
        res.status(400).send(error400)
      }
    } catch (error) {
      res.status(400).send(error400)
    }
  })
  //add question
  .post('/question', async (req, res) => {
    let {
      _id,
      quiz,
      ans,
      correct_id,
      correct_point,
      incorrect_point,
      duration,
      img_path,
    } = req.body.newQuestion
    // let newQuestion = JSON.parse(req.body.newQuestion)
    let user = await Utility.verifyToken(req.headers.token)
    if (!user) {
      res.status(401).send(error401)
    }
    if (_id && quiz && ans && correct_id && correct_point && incorrect_point && duration) {
      img_path = await Cloudinary.upload(img_path)
      let result = await quest.addQuestion(
        {
          _id,
          quiz,
          ans,
          correct_id,
          correct_point,
          incorrect_point,
          duration,
          img_path,
        },
        user._id
      )
      res.status(200).send(result)
    } else {
      res.status(400).send(error400)
    }
  })
  //add question
  .post('/like', async (req, res) => { 
    //add later
  })
  //start game
  .post('/start', async (req, res) => {
    if (req.body.idQuest) {
      try {
        let idGame = await quest.startQuest(req.headers.token, req.body.idQuest)
        let code = Utility.createGameCode(idGame)
        res.status(200).send({
          code: code.toString(),
          idGame,
        })
      } catch (error) {
        res.status(400).json({
          ...error400,
          statusMessage: error,
        })
      }
    } else {
      res.status(400).json(error400)
    }
  })
//get result
module.exports = router
