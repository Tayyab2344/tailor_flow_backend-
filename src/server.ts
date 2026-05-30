import dotenv from 'dotenv';
import path from 'path';

// Load environmental config before anything else
dotenv.config({ path: path.join(__dirname, '../.env') });

import app from './app';
import logger from './utils/logger';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`⚡️[server]: TailorFlow Server is running in ${process.env.NODE_ENV} mode at http://localhost:${PORT}`);
  logger.info(`📖[swagger]: Documentation available at http://localhost:${PORT}/api-docs`);
});

// Handle uncaught exceptions and unhandled rejections cleanly
process.on('unhandledRejection', (err: Error) => {
  logger.error(`Unhandled Promise Rejection: ${err.message}`, { stack: err.stack });
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}`, { stack: err.stack });
  server.close(() => process.exit(1));
});
