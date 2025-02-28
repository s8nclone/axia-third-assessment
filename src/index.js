const app = require('./app');
// const connectDB = require('./config/database');
const { PORT, NODE_ENV } = require('./config/env');
const date = new Date();

// Connect to database
// connectDB();

const port = PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${port}. ${date}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = server;