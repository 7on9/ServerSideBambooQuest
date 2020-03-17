let router = require('express').Router()
let quest = require('../controllers/quest')
let Utility = require('../common/utility')
let Cloudinary = require('../controllers/cloudinary')

router
  //getInfo - owner
  .get('/myQuests', async (req, res) => {
    Utility.verifyToken(req.headers.token, (err, user) => {
      if (user) {
        quest.getQuestsOfUser(user._id, (error, myQuests) => {
          if (error) {
            res.status(404)
          } else {
            res.status(200).send({ myQuests })
          }
        })
      }
    })
  })
  // Get all quests of account
  .get('/my/:id', async (req, res) => {
    Utility.verifyToken(req.headers.token, (err, user) => {
      if (user) {
        if (req.headers._id) {
          quest.getInfo(user._id, req.params.id, (err, result) => {
            if (err) {
              res.status(404).json({
                result: false,
                detail: 'QUERY_ERROR',
              })
            } else {
              res.status(200).json({
                result: true,
                detail: result,
              })
            }
          })
        } else {
          res.status(404).json({
            result: false,
            detail: 'QUERY_ERROR',
          })
        }
      } else {
        res.status(401).send({
          result: false,
          detail: 'UNAUTHORIZED',
        })
      }
    })
  })
  .get('/question/:id', async (req, res) => {
    let questions = await quest.getAllQuestionsOfQuest(req.params.id)
    res.status(200).json(questions)
  })
  .get('/:id', async (req, res) => {
    let infoQuest = await quest.getPublicInfoQuest(req.params.id)
    res.status(200).send({
      result: true,
      info: infoQuest,
    })
  })
  //get all public quests
  .get('/', async (req, res) => {
    let { params } = req
    let quests = await quest.getPublicQuests(params.limit)
    res.status(200).json({
      result: true,
      quests,
    })
  })
  //create quest
  .post('/', async (req, res) => {
    let newQuest = JSON.parse(req.body.newQuest)
    Utility.verifyToken(req.headers.token, (err, user) => {
      if (user) {
        if (newQuest.title && newQuest.description && newQuest.is_public != null) {
          Cloudinary.upload(newQuest.img_path, (err, url) => {
            newQuest.img_path = url
            quest.createQuest(newQuest, user, (err, result) => {
              if (err) {
                res.status(404).json({
                  result: false,
                  detail: 'QUERY_ERROR',
                })
              } else {
                res.status(200).json({
                  result: true,
                  detail: result,
                })
              }
            })
          })
        } else {
          res.status(404).json({
            result: false,
            detail: 'QUERY_ERROR',
          })
        }
      } else {
        res.status(401).send({
          result: false,
          detail: 'UNAUTHORIZED',
        })
      }
    })
  })
  //add question
  .post('/question', async (req, res) => {
    let newQuestion = JSON.parse(req.body.newQuestion)
    Utility.verifyToken(req.headers.token, (err, user) => {
      if (user) {
        if (
          newQuestion._id &&
          newQuestion.quiz &&
          newQuestion.ans &&
          newQuestion.correct_id &&
          newQuestion.correct_point &&
          newQuestion.incorrect_point &&
          newQuestion.duration
        ) {
          Cloudinary.upload(newQuestion.img_path, (err, url) => {
            newQuestion.img_path = url
            quest.addQuestion(newQuestion, user._id, (err, result) => {
              if (err) {
                res.status(404).json({
                  result: false,
                  detail: 'QUERY_ERROR',
                })
              } else {
                res.status(200).json({
                  result: true,
                  detail: result.questions,
                })
              }
            })
          })
        } else {
          res.status(404).json({
            result: false,
            detail: 'QUERY_ERROR',
          })
        }
      } else {
        res.status(401).send({
          result: false,
          detail: 'UNAUTHORIZED',
        })
      }
    })
  })
  //add question
  .post('/like', async (req, res) => {
    let newQuestion = JSON.parse(req.body.newQuestion)
    Utility.verifyToken(req.headers.token, (err, user) => {
      if (user) {
        if (
          newQuestion._id &&
          newQuestion.quiz &&
          newQuestion.ans &&
          newQuestion.correct_id &&
          newQuestion.correct_point &&
          newQuestion.incorrect_point &&
          newQuestion.duration
        ) {
          Cloudinary.upload(newQuestion.img_path, (err, url) => {
            newQuestion.img_path = url
            quest.addQuestion(newQuestion, user._id, (err, result) => {
              if (err) {
                res.status(404).json({
                  result: false,
                  detail: 'QUERY_ERROR',
                })
              } else {
                res.status(200).json({
                  result: true,
                  detail: result.questions,
                })
              }
            })
          })
        } else {
          res.status(404).json({
            result: false,
            detail: 'QUERY_ERROR',
          })
        }
      } else {
        res.status(401).send({
          result: false,
          detail: 'UNAUTHORIZED',
        })
      }
    })
  })
  //start game
  .post('/start', async (req, res) => {
    if (req.body.idQuest) {
      quest.startQuest(req.headers.token, req.body.idQuest, (err, result) => {
        if (err) {
          res.status(404).json({
            result: false,
            detail: 'QUERY_ERROR',
          })
        } else {
          let code = Utility.createGameCode(result)
          res.status(200).send({
            result: true,
            code: code.toString(),
            idGame: result,
          })
        }
      })
    } else {
      res.status(404).json({
        result: false,
        detail: 'QUERY_ERROR',
      })
    }
  })
  //join game
  /* FOR TESTING ONLY */
  .post('/join', (req, res) => {
    if (req.body.idGame && req.body.username) {
      quest.joinQuest(req.body.idGame, req.body.username, req.headers.token, (err, result) => {
        if (err) {
          res.status(404).json({
            result: false,
            detail: err,
          })
        } else {
          res.status(200).json({
            result: true,
            detail: result,
          })
        }
      })
    } else {
      res.status(404).json({
        result: false,
        detail: 'QUERY_ERROR',
      })
    }
  })
  //answer
  .post('/answer', (req, res) => {
    quest.answer(
      req.body.idGame,
      req.body.username,
      req.body.idAnswer,
      req.body.time,
      (err, result) => {
        if (err) {
          res.status(404).json({
            result: false,
            detail: err,
          })
        } else {
          res.status(200).json({
            result: true,
            detail: result,
          })
        }
      }
    )
  })
//get result
module.exports = router
