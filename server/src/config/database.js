import Sequelize from 'sequelize';
import logger from '../logger';

const db = new Sequelize(
  `postgres://${process.env.RDS_USERNAME}:${process.env.RDS_PASSWORD}@${process.env.RDS_HOSTNAME}:${process.env.RDS_PORT}/${process.env.RDS_DB_NAME}`,
  { logging: message => logger.info(message) },
);

export default db;
