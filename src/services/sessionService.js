// store active quiz sessions
const quizSessions = new Map();

const sessionService = {
  // generate unique session ID
  generateSessionId: () => {
    return Math.random().toString(36).substr(2, 9);
  },

  // create a new session
  createSession: (sessionId, sessionData) => {
    quizSessions.set(sessionId, sessionData);
  },

  // get session by ID
  getSession: (sessionId) => {
    return quizSessions.get(sessionId);
  },

  // update session
  updateSession: (sessionId, sessionData) => {
    quizSessions.set(sessionId, sessionData);
  },

  // delete session
  deleteSession: (sessionId) => {
    quizSessions.delete(sessionId);
  },

  // clean up old sessions
  cleanupOldSessions: () => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [sessionId, session] of quizSessions.entries()) {
      if (session.startTime < oneHourAgo) {
        quizSessions.delete(sessionId);
      }
    }
  },

  // initalize cleanup interval
  initCleanup: () => {
    // Clean up old sessions every hour
    setInterval(() => {
      sessionService.cleanupOldSessions();
    }, 60 * 60 * 1000);
  }
};

// Start cleanup when module is loaded
sessionService.initCleanup();

module.exports = sessionService;