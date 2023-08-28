import Sequelize from 'sequelize';
import db from '../../config/database';

// Create Schema
const Plate = db.define('plate', {
  registration: Sequelize.STRING,
});

export default Plate;
