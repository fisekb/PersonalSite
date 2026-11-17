const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error); // Logs the full error object and stack trace
    process.exit(1);
  }
};

// startServer();


// const startServer = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection successful.');

//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error('Database connection failed:', error.message);
//     process.exit(1);
//   }

//   };
const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down server...`);

  try {
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error.message);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
