import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const databaseUrl =
  process.env.DATABASE_URL ||
  (process.env.NODE_ENV === 'production'
    ? process.env.DATABASE_URL_PRODUCTION
    : process.env.DATABASE_URL_DEVELOPMENT);

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL (or DATABASE_URL_DEVELOPMENT / DATABASE_URL_PRODUCTION) is required in .env file'
  );
}
const url = new URL(databaseUrl);
const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
const needsSSL = !isLocalhost;

const sequelize = new Sequelize(databaseUrl!, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: needsSSL ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  } : {},
});

if (!sequelize || typeof sequelize.authenticate !== 'function') {
  throw new Error('Failed to initialize Sequelize instance');
}

const sequelizeAny = sequelize as any;
if (!sequelizeAny.options || !sequelizeAny.options.define) {
  throw new Error('Sequelize instance does not have proper options.define structure');
}

export default sequelize;
