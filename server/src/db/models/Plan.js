import Sequelize from 'sequelize';
import db from '../../config/database';

// Create Schema
const Plan = db.define('plan', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  stripeId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  vehicleType: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  // Amount in cents
  amount: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  interval: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default Plan;
