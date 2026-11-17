const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const { generalLimiter } = require('./middlewares/rateLimiter');

dotenv.config();

const app = express();
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

app.use(helmet());
app.use(
  cors({
    origin: clientUrl,
    credentials: true
  })
);
app.use(compression());
app.use(morgan('dev'));
app.use(generalLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.send('Portfolio API is running.');
});

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
