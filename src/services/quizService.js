const sessionService = require('./sessionService');
const { loadQuestions, shuffleArray } = require('../utils/helpers');

const quizService = {
  // create a new quiz session
  createQuiz: async (questionCount) => {
    const allQuestions = loadQuestions();
    const sessionId = sessionService.generateSessionId();
    
    // select random questions
    const shuffledQuestions = shuffleArray(allQuestions);
    const selectedQuestions = shuffledQuestions.slice(0, Math.min(questionCount, allQuestions.length));
    
    // create a session
    const sessionData = {
      questions: selectedQuestions,
      currentQuestion: 0,
      score: 0,
      answers: [],
      startTime: Date.now()
    };
    
    sessionService.createSession(sessionId, sessionData);
    
    return {
      sessionId,
      totalQuestions: selectedQuestions.length,
      message: 'Quiz started successfully'
    };
  },

  // get the current question for a session
  getCurrentQuestion: async (sessionId) => {
    const session = sessionService.getSession(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    if (session.currentQuestion >= session.questions.length) {
      throw new Error('Quiz completed');
    }
    
    const currentQ = session.questions[session.currentQuestion];
    
    return {
      questionNumber: session.currentQuestion + 1,
      totalQuestions: session.questions.length,
      question: currentQ.question,
      answers: currentQ.answers
    };
  },

  // submit an answer
  submitAnswer: async (sessionId, answerIndex) => {
    const session = sessionService.getSession(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    if (session.currentQuestion >= session.questions.length) {
      throw new Error('Quiz already completed');
    }
    
    const currentQ = session.questions[session.currentQuestion];
    const isCorrect = answerIndex === currentQ.correct;
    
    if (isCorrect) {
      session.score++;
    }
    
    session.answers.push({
      question: currentQ.question,
      userAnswer: answerIndex,
      correctAnswer: currentQ.correct,
      isCorrect
    });
    
    session.currentQuestion++;
    
    // update the session
    sessionService.updateSession(sessionId, session);
    
    return {
      correct: isCorrect,
      correctAnswer: currentQ.correct,
      explanation: currentQ.explanation || null
    };
  },

  // get the quiz results
  getQuizResults: async (sessionId) => {
    const session = sessionService.getSession(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - session.startTime) / 1000);
    
    return {
      score: session.score,
      totalQuestions: session.questions.length,
      percentage: Math.round((session.score / session.questions.length) * 100),
      timeTaken,
      answers: session.answers
    };
  }
};

module.exports = quizService;