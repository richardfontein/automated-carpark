import Sequelize from 'sequelize';
import db from '../../config/database';
import Tenancy from './Tenancy';
// Create Schema
const User = db.define(
  'user',
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    company: Sequelize.STRING,
    stripeCustomerId: {
      type: Sequelize.STRING,
      unique: true,
    },
    stripeSubscriptionId: {
      type: Sequelize.STRING,
      unique: true,
    },
    xeroContactId: {
      type: Sequelize.STRING,
      unique: true,
    },
    billingCycleAnchor: Sequelize.DATE,
    corporateCarparks: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
    resetPasswordToken: Sequelize.STRING,
    resetPasswordExpires: Sequelize.DATE,
  },

  {
    defaultScope: {
      attributes: {
        exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'],
      },
    },
  },
);

// onDelete allow us to cascade deletes
User.hasMany(Tenancy, { onDelete: 'cascade' });
Tenancy.belongsTo(User);

export default User;
