const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${err.message}`);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', '), data: null });
  }

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'Duplicate entry: this email is already registered for this tournament.', data: null });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format.', data: null });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message || 'Internal server error', data: null });
};

module.exports = errorHandler;
