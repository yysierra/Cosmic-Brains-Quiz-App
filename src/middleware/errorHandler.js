const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  
  // handle specific error types
  if (err.message === 'Session not found') {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  if (err.message === 'Quiz completed' || err.message === 'Quiz already completed') {
    return res.status(400).json({ error: err.message });
  }
  
  // default error response
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

module.exports = errorHandler;