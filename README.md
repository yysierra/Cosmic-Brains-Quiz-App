## 🌌 Cosmic Quiz

This is a full-stack quiz game developed by:

- **Edwin** - Backend (Node.js, Express) & Deployment
    
- **Yahir** - Frontend JavaScript (Logic, API interaction, interactivity) & HTML/CSS Review
    
- **Kevin** - Frontend HTML/CSS (UI & Layout)
    

---

## 📋 Project Description

Cosmic Quiz is a trivia game where players can:

- Answer up to 10 questions.
    
- Have 30 seconds to answer each question.
    
- View their score after completing the quiz.
    

---

## 🖥️ Backend by Edwin

The backend, developed by Edwin, handles quiz-specific business logic and question management.

### Key Features:

- **Question Management**: Loads and serves quiz questions from `questions.json`.
    
- **Completion Handling**: Manages quiz completion and result generation.
    
- **Quiz Logic**: Implements scoring, question progression, and game state management.
    
- **Error Processing**: Catches and processes application errors.
    
- **Express Setup**: Configures the Express.js server and middleware.
    

---

## ⚡ JavaScript by Yahir

Yahir's work on the JavaScript focuses on client-side quiz functionality and user interaction management.

### Key Functions:

- **`StartQuiz()`**: Initializes all necessary values to begin the quiz.
    
- **`Question()`**: Loads and displays quiz questions.
    
- **`Answer()`**: Processes the selected answer, providing feedback on its correctness.
    
- **`Result()`**: Shows the player's percentage of correct answers and provides a performance message and title.
    
- **`Timer()`**: Manages the 30-second countdown for each question, resetting it at the start of every new question.
    

---

## 🎨 HTML/CSS by Kevin

Kevin's contributions involve the frontend page structure and visual design implementation.

### Page Structure:

- **`Home-Page`**: The home page where players can start the quiz.
    
- **`Quiz-Page`**: The quiz page where the 10 questions will be asked sequentially.
    
- **`Results-Page`**: The results page where the final score is displayed.
    

---

## 🚀 Getting Started

### ✅ Prerequisites

Before running the Cosmic Quiz App, ensure you have the following installed:

- **Node.js**: Version 14.0 or higher. [Download here](https://nodejs.org/en/download/).
    
- **npm**: This comes bundled with Node.js.
    
- **A web browser**: (e.g., Chrome, Firefox, Safari, Edge).
    

### 📦 Step 1: Download the Project

If you have the project folder, navigate to it using your terminal:

Bash

```
cd cosmic-quiz-app
```

### 🔧 Step 2: Enhanced Setup Process

First, create a `package.json` file with default settings:

Bash

```
npm init -y
```

Next, install all necessary dependencies:

Bash

```
npm install
```

For development, install `nodemon`, which automatically restarts the server when file changes are detected:

Bash

```
npm i nodemon
```

- **Note**: This may take a few minutes. You'll see a progress bar as npm downloads the necessary packages.
    

### 🎯 Step 3: Simplified Server Start

Launch the localhost server running on port 3000:

Bash

```
nodemon start
```

---

**🌌 Cosmic Quiz App is ready!** Open your web browser and go to: [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
