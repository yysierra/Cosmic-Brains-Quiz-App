const quizService = require('../services/quizService');
const sessionService = require('../services/sessionService');

const quizController = {
  // start/create a new quiz
  startQuiz: async (req, res, next) => {
    try {
      const { questionCount = 10 } = req.body;
      const result = await quizService.createQuiz(questionCount);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // get current question
  getCurrentQuestion: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const question = await quizService.getCurrentQuestion(sessionId);
      res.json(question);
    } catch (error) {
      next(error);
    }
  },

  // submit answer
  submitAnswer: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const { answerIndex } = req.body;
      const result = await quizService.submitAnswer(sessionId, answerIndex);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // get quiz results
  getResults: async (req, res, next) => {
    try {
      const { sessionId } = req.params;
      const results = await quizService.getQuizResults(sessionId);
      res.json(results);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = quizController;