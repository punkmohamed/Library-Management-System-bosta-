import { Sequelize } from 'sequelize';
import sequelize from '../config/database';

let sequelizeInstance: Sequelize | null = sequelize;

export const getSequelize = (): Sequelize => {
  if (!sequelizeInstance) {
    throw new Error('Sequelize instance has not been set. Make sure to call setSequelize() before importing models.');
  }
  return sequelizeInstance;
};

export const setSequelize = (instance: Sequelize): void => {
  // Verify it's a Sequelize instance
  if (!instance) {
    throw new Error('setSequelize: instance is null or undefined');
  }
  
  // Verify it has required Sequelize properties (more reliable than instanceof)
  if (typeof instance.authenticate !== 'function') {
    throw new Error('setSequelize: instance does not have authenticate method');
  }
  
  // Verify it has options.define (needed for Model.init)
  const instanceAny = instance as any;
  if (!instanceAny.options || !instanceAny.options.define) {
    throw new Error('setSequelize: instance does not have options.define structure');
  }
  
  // Verify it has other Sequelize methods
  if (typeof instanceAny.define !== 'function') {
    throw new Error('setSequelize: instance does not have define method');
  }
  
  sequelizeInstance = instance;
};

// Auto-initialize if possible
if (sequelize) {
  try {
    setSequelize(sequelize);
  } catch (error) {
    // Already set or failed validation - ignore here
  }
}
