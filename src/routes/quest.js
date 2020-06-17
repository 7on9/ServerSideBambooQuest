let router = require('express').Router()
let {
  addQuestion,
  createQuest,
  getAllQuestionsOfQuest,
  getInfo,
  getPublicInfoQuest,
  getPublicQuests,
  getQuestsOfUser,
  startQuest,
  editQuest,
  deleteQuestion,
  deleteQuest,
  likeQuest,
} = require('../controllers/quest')
let Utility = require('../common/utility')
let { error400, error404, error401 } = require('../common/constant/error').CODE
let Cloudinary = require('../controllers/cloudinary')
let administrator = require('../controllers/role')
router
  //Get all quests of account
  .get('/my-quests', async (req, res) => {
    try {
      let user = await Utility.verifyToken(req.headers.token)
      if (user) {
        let myQuests = await getQuestsOfUser(user._id)
        res.status(200).json(myQuests)
      } else {
        res.status(400).json(error401)
      }
    } catch (error) {
      res.status(400).json({ ...error400, errorMessage: error })
    }
  })
  // Get all quests of account
  .get('/user/:id', async (req, res) => {
    let { id } = req.params
    if (!id) {
      res.status(404).json({
        ...error404,
        statusMessage: 'Missing parameter id',
      })
    }
    try {
      let user = await Utility.verifyToken(req.headers.token)
      if (user) {
        let quest = await getInfo(user._id, req.params.id)
        res.status(200).json(quest)
      } else {
        res.status(401).json(error401)
      }
    } catch (error) {
      console.log(error)
      res.status(400).json(error)
    }
  })
  // Get all questions of quest with id
  .get('/:id/questions', async (req, res) => {
    try {
      let questions = await getAllQuestionsOfQuest(req.params.id)
      res.status(200).json(questions)
    } catch (error) {
      res.status(400).json(error)
    }
  })
  .get('/:id', async (req, res) => {
    try {
      let user = await Utility.verifyToken(req.headers.token).catch(() => null)
      let quest = await getPublicInfoQuest(req.params.id, user)
      res.status(200).json(quest._doc || quest)
    } catch (error) {
      console.log(error)
      res.status(error.statusCode).json(error)
    }
  })
  // get all quest
  .get('/', async (req, res) => {
    try {
      let { limit, skip, filter } = req.query
      limit = Number.parseInt(limit)
      skip = Number.parseInt(skip)
      filter = filter ? JSON.parse(filter) : {}
      let quests = await getPublicQuests(limit || 25, skip || 0, filter)
      res.status(200).json(quests._doc || quests)
    } catch (error) {
      console.log(error)
      res.status(400).json({
        ...error400,
        statusMessage: error,
      })
    }
  })
  //create quest
  .post('/', async (req, res) => {
    try {
      let newQuest = req.body.newQuest
      let user = await Utility.verifyToken(req.headers.token)
      if (!user) {
        res.status(401).json(error401)
      }
      if (newQuest.title && newQuest.description && newQuest.is_public != null) {
        newQuest.img_path = newQuest.img_path ? await Cloudinary.upload(newQuest.img_path) : null
        let result = await createQuest(newQuest, user)
        res.status(200).json(result)
      } else {
        res.status(400).json(error400)
      }
    } catch (error) {
      res.status(400).json(error400)
    }
  })

  //update quiz
  .post('/update', async (req, res) => {
    try {
      let newQuest = req.body.newQuest
      let user = await Utility.verifyToken(req.headers.token)
      if (!user) {
        res.status(401).json(error401)
      }
      if (newQuest) {
        let result = await editQuest(newQuest, user)
        res.status(200).json(result)
      } else {
        res.status(400).json(error400)
      }
    } catch (error) {
      res.status(400).json(error400)
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
      res.status(401)
    }
    if (_id && quiz && ans && correct_id && correct_point && incorrect_point && duration) {
      try {
        img_path = img_path ? await Cloudinary.upload(img_path) : null
        let result = await addQuestion(
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
        res.status(200).json(result)
      } catch (error) {
        res.status(400).json(error)
      }
    } else {
      res.status(400).json(error400)
    }
  })

  //delete question
  .post('/delete-question', async (req, res) => {
    try {
      let { quest } = req.body
      let user = await Utility.verifyToken(req.headers.token)
      if (!user) {
        res.status(401).json(error401)
      }
      if (quest) {
        let result = await deleteQuestion(quest, user)
        res.status(200).json(result)
      } else {
        res.status(400).json(error400)
      }
    } catch (error) {
      res.status(400).json(error400)
    }
  })

  //add question
  .post('/like', async (req, res) => {
    let { _id } = req.body
    let user = await Utility.verifyToken(req.headers.token)
    if (!user) {
      res.status(401).json(error401)
    } else {
      const result = await likeQuest(_id, user)
      res.status(200).json(result)
    }
  })
  //start game
  .post('/start', async (req, res) => {
    if (req.body.idQuest) {
      try {
        let idGame = await startQuest(req.headers.token, req.body.idQuest)
        let code = Utility.createGameCode(idGame)
        res.status(200).json({
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
  .get('/delete/:id', async (req, res) => {
    try {
      let { id } = req.params
      res.status(200).json({ result: await deleteQuest(req.headers.token, id) })
    } catch (error) {
      console.log(error)
      res.status(400).json({
        ...error400,
        errorMessage: error,
      })
    }
  })
module.exports = router
