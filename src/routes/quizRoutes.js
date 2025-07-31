const express = require('express');
const quizController = require('../controllers/quizController');

const router = express.Router();

router.post('/start-quiz', quizController.startQuiz);
router.get('/question/:sessionId', quizController.getCurrentQuestion);
router.post('/answer/:sessionId', quizController.submitAnswer);
router.get('/results/:sessionId', quizController.getResults);

module.exports = router;