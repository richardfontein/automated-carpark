import '@babel/polyfill';
import {} from 'dotenv/config';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import db from './config/database';
import './jobs';
import logger from './logger';
import routes from './routes';
import clientErrorHandler from './middleware/clientErrorHandler';
import logErrors from './middleware/logErrors';
import errorHandler from './middleware/errorHandler';

// Test db connection
db.authenticate()
  .then(() => logger.info('Database connected...'))
  .catch(err => logger.error(`Error: ${err}`));

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP Logger
app.use(
  morgan('tiny', { stream: { write: message => logger.info(message.trim()) } })
);

// Routes
app.use('/api', routes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '..', '..', 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '..', '..', 'client', 'build', 'index.html')
    );
  });
}

// Error Handling
app.use(clientErrorHandler);
app.use(logErrors);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server started on port ${PORT}...`));
