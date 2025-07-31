// Quiz state variables
let currentQuestion = 0;
let totalQuestions = 10;
let timeLeft = 30;
let timer = null;
let score = 0;
let selectedAnswer = null;
let userAnswers = [];
let startTime = null;
let sessionId = null;
let currentQuestionData = null;
let quizResults = null;

// Initialize event listeners when page loads
function initializeEventListeners() {
    // Home page events
    document.getElementById('start-btn').addEventListener('click', startQuiz);
    
    // Results page events
    document.getElementById('restart-btn').addEventListener('click', goHome);
    document.getElementById('review-btn').addEventListener('click', toggleAnswersReview);
}

async function startQuiz() {
    try {
        // Reset quiz state 
        currentQuestion = 0;
        score = 0;
        userAnswers = [];
        startTime = new Date();
        
        // Start quiz session with server 
        const response = await fetch('/api/start-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                questionCount: totalQuestions
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to start quiz');
        }
        
        const data = await response.json();
        sessionId = data.sessionId;
        totalQuestions = data.totalQuestions;
        
        showPage('quiz-page');
        loadQuestion();
    } catch (error) {
        console.error('Error starting quiz:', error);
        alert('Failed to start quiz. Please try again.');
    }
}

async function loadQuestion() {
    if (currentQuestion >= totalQuestions) {
        showResults();
        return;
    }

    try {
        // Get current question from server
        const response = await fetch(`/api/question/${sessionId}`);
        
        if (!response.ok) {
            throw new Error('Failed to load question');
        }
        
        const questionData = await response.json();
        currentQuestionData = questionData;
        
        displayQuestion(questionData);
        startTimer();
    } catch (error) {
        console.error('Error loading question:', error);
        alert('Failed to load question. Please try again.');
    }
}

function displayQuestion(questionData) {
    // Update progress
    const progress = (questionData.questionNumber / questionData.totalQuestions) * 100;
    document.getElementById('progress').style.width = progress + '%';
    document.getElementById('question-counter').textContent = 
        `Question ${questionData.questionNumber} of ${questionData.totalQuestions}`;
    
    // Display question
    document.getElementById('question-text').textContent = questionData.question;
    
    // Display answers
    const answersContainer = document.getElementById('answers-container');
    answersContainer.innerHTML = '';
    
    questionData.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
        button.addEventListener('click', () => selectAnswer(index, button));
        answersContainer.appendChild(button);
    });
    
    // Reset state
    selectedAnswer = null;
}

async function selectAnswer(answerIndex, buttonElement) {
    // Prevent multiple selections
    if (selectedAnswer !== null) return;
    
    selectedAnswer = answerIndex;
    stopTimer();
    
    // Disable all answer buttons
    const answerButtons = document.querySelectorAll('.answer-btn');
    answerButtons.forEach(btn => btn.disabled = true);
    
    // Highlight selected answer
    buttonElement.classList.add('selected');
    
    // Process the answer with server
    await processAnswer(answerIndex);
}

async function processAnswer(answerIndex) {
    try {
        // Submit answer to server
        const response = await fetch(`/api/answer/${sessionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                answerIndex: answerIndex
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit answer');
        }
        
        const result = await response.json();
        const isCorrect = result.correct;
        const correctAnswer = result.correctAnswer;
        
        if (isCorrect) {
            score++;
        }
        
        // Store the answer for local display
        userAnswers.push({
            question: currentQuestionData.question,
            userAnswer: answerIndex,
            correctAnswer: correctAnswer,
            isCorrect: isCorrect,
            answers: currentQuestionData.answers
        });
        
        // Show feedback
        showAnswerFeedback(correctAnswer, answerIndex);
    } catch (error) {
        console.error('Error processing answer:', error);
        alert('Failed to submit answer. Please try again.');
    }
}

function showAnswerFeedback(correctAnswer, userAnswer) {
    const answerButtons = document.querySelectorAll('.answer-btn');
    
    // Show correct answer in green
    answerButtons[correctAnswer].classList.add('correct');
    
    // Show incorrect user answer in red (if different from correct)
    if (userAnswer !== correctAnswer) {
        answerButtons[userAnswer].classList.add('incorrect');
    }
    
    // Auto-advance after showing feedback
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < totalQuestions) {
            loadQuestion();
        } else {
            showResults();
        }
    }, 2000);
}

async function showResults() {
    try {
        // Get results from server
        const response = await fetch(`/api/results/${sessionId}`);
        
        if (!response.ok) {
            throw new Error('Failed to get results');
        }
        
        const resultsData = await response.json();
        
        // Add local answers data for review
        resultsData.detailedAnswers = userAnswers;
        
        displayResults(resultsData);
        showPage('results-page');
    } catch (error) {
        console.error('Error getting results:', error);
        // Fallback to local calculation if server fails
        const endTime = new Date();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
        const percentage = Math.round((score / totalQuestions) * 100);
        
        const resultsData = {
            score: score,
            totalQuestions: totalQuestions,
            percentage: percentage,
            timeTaken: timeTaken,
            detailedAnswers: userAnswers
        };
        
        displayResults(resultsData);
        showPage('results-page');
    }
}

function displayResults(resultsData) {
    // Update score display to the results after the data is collected. 
    document.getElementById('score-percentage').textContent = resultsData.percentage + '%';
    document.getElementById('correct-answers').textContent = resultsData.score;
    document.getElementById('total-questions').textContent = resultsData.totalQuestions;
    
    // Format time taken 
    const minutes = Math.floor(resultsData.timeTaken / 60);
    const seconds = resultsData.timeTaken % 60;
    document.getElementById('time-taken').textContent = 
        `${minutes}m ${seconds}s`;
    
    // Set achievement badge and message when finished with the quiz
    const percentage = resultsData.percentage;
    let badge, title, message;
    
    if (percentage >= 90) {
        badge = '🌟';
        title = 'Cosmic Wizard!';
        message = 'Outstanding! The universe sings to you! 🌌';
    } else if (percentage >= 80) {
        badge = '🏆';
        title = 'Space Warrior!';
        message = 'Excellent work! Your brain is out of this world. 🚀';
    } else if (percentage >= 70) {
        badge = '🎖️';
        title = 'Young Pupil!';
        message = 'Good job! Keep at it youngin. ⭐';
    } else if (percentage >= 60) {
        badge = '🏅';
        title = 'Curious Novice!';
        message = 'Nice try! Time to brush up on your facts! 🌙';
    } else {
        badge = '🛸';
        title = 'Nice Try Buddy!';
        message = 'No worries! There is infinite learning to be done! 🌌';
    }
    
    document.getElementById('achievement-badge').textContent = badge;
    document.getElementById('results-title').textContent = title;
    document.getElementById('performance-message').textContent = message;
    
    // Store results for review
    quizResults = resultsData;
}

function toggleAnswersReview() {
    const reviewContainer = document.getElementById('answers-review');
    const reviewBtn = document.getElementById('review-btn');
    
    if (reviewContainer.style.display === 'none') {
        displayAnswersReview();
        reviewContainer.style.display = 'block';
        reviewBtn.textContent = '🔼 Hide Review';
    } else {
        reviewContainer.style.display = 'none';
        reviewBtn.textContent = '📋 Review Answers';
    }
}

function displayAnswersReview() {
    const reviewContainer = document.getElementById('answers-review');
    reviewContainer.innerHTML = '<h3 style="margin-bottom: 20px; color: #00f5ff;">📋 Answer Review</h3>';
    
    const answersToReview = quizResults.detailedAnswers || quizResults.answers || [];
    
    answersToReview.forEach((answer, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
        
        const userAnswerText = answer.answers ? answer.answers[answer.userAnswer] : `Option ${String.fromCharCode(65 + answer.userAnswer)}`;
        const correctAnswerText = answer.answers ? answer.answers[answer.correctAnswer] : `Option ${String.fromCharCode(65 + answer.correctAnswer)}`;
        
        reviewItem.innerHTML = `
            <div class="review-question">
                ${index + 1}. ${answer.question}
            </div>
            <div class="review-answers">
                <p><strong>Your answer:</strong> ${answer.isCorrect ? '✅' : '❌'} ${userAnswerText}</p>
                ${!answer.isCorrect ? `<p><strong>Correct answer:</strong> ✅ ${correctAnswerText}</p>` : ''}
            </div>
        `;
        
        reviewContainer.appendChild(reviewItem);
    });
}

function startTimer() {
    timeLeft = 30;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            timeUp();
        }
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('time-left');
    timerElement.textContent = timeLeft;
    
    // Change color when time is running out in the timer
    if (timeLeft <= 5) {
        timerElement.style.color = '#ff006e';
    } else if (timeLeft <= 10) {
        timerElement.style.color = '#ffa500';
    } else {
        timerElement.style.color = '#00f5ff';
    }
}

function timeUp() {
    stopTimer();

    if (selectedAnswer === null) {
        const firstAnswer = document.querySelector('.answer-btn');
        if (firstAnswer) {
            selectAnswer(0, firstAnswer);
        }
    }
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
}

function goHome() {
    currentQuestion = 0;
    sessionId = null;
    stopTimer();
    showPage('home-page');
}

// Initialize the quiz app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});

// Add visual effects (same as before)
document.addEventListener('DOMContentLoaded', () => {
    // Add click effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});