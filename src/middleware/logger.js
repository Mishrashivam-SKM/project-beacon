const morgan = require('morgan');

/**
 * Request logging middleware.
 * Uses 'dev' format in development for colorful, concise logs.
 * Uses 'combined' format in production for detailed Apache-style logs.
 */
const requestLogger = morgan(
  process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
);

module.exports = requestLogger;
