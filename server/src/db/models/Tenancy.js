import Sequelize from 'sequelize';
import db from '../../config/database';

import Plate from './Plate';
import Plan from './Plan';

// Create Schema
const Tenancy = db.define(
  'tenancy',
  {
    vehicleType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    endDate: Sequelize.DATE,
    nickname: Sequelize.STRING,
    subscriptionStarted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    subscriptionEnded: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    paid: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    defaultScope: {
      include: [Plate, Plan],
    },
  },
);

// onDelete allow us to cascade deletes
Tenancy.hasMany(Plate, { onDelete: 'cascade' });
Plate.belongsTo(Tenancy);
Tenancy.hasOne(Plan, {
  foreignKey: 'vehicleType',
  sourceKey: 'vehicleType',
  constraints: false,
});
Plan.belongsTo(Tenancy, {
  foreignKey: 'vehicleType',
  sourceKey: 'vehicleType',
  constraints: false,
});

export default Tenancy;
