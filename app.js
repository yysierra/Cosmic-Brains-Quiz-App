const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const quizRoutes = require('./src/routes/quizRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// creating the middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api', quizRoutes);

// server the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Quiz server running on port ${PORT}`);
});