import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger.js';

export const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'comparegenius',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5434'),
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development'
    ? (msg) => logger.debug(msg)
    : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Sync models in development
    if (process.env.NODE_ENV === 'development') {
      // Use force: true on first run to create tables from scratch
      await sequelize.sync({ force: true });
      logger.info('Database models synchronized');
    }
  } catch (error) {
    logger.error('Unable to connect to database:', error);
    throw error;
  }
}

export async function disconnectDatabase() {
  await sequelize.close();
  logger.info('Database connection closed');
}
