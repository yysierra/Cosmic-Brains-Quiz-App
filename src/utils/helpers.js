const fs = require('fs');
const path = require('path');

const helpers = {
  // load questions from JSON file
  loadQuestions: () => {
    try {
      const data = fs.readFileSync(path.join(__dirname, '../../questions.json'), 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.log('Using default questions (questions.json not found)');
      return defaultQuestions;
    }
  },

  // shuffle array function
  shuffleArray: (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};

module.exports = helpers;