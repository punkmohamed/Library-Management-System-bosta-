import dotenv from 'dotenv';
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { Logger } from "./helpers/logger.helper";

import { ResponseHelper } from "./helpers/response.helper";
import { errorHandler } from "./middleware/error.middleware";
import apiRoutes from "./routes";

import sequelizeModule from './config/database';
import { Sequelize } from "sequelize";
import { setSequelize } from "./models/sequelize-helper";
const sequelize = sequelizeModule as Sequelize;

if (!sequelize) {
  throw new Error('Sequelize instance is null or undefined');
}

if (typeof sequelize.authenticate !== 'function') {
  throw new Error('Sequelize instance does not have authenticate method');
}

const sequelizeAny = sequelize as any;
if (!sequelizeAny.options || !sequelizeAny.options.define) {
  throw new Error('Sequelize instance does not have proper options.define structure');
}

setSequelize(sequelize);

import("./models").then(() => {
  sequelize
    .authenticate()
    .then(async () => {
      Logger.info('Database connection established successfully.');
      await sequelize.sync({ alter: true });
      Logger.info('Database models synchronized.');
    })
    .catch((error) => {
      Logger.error('Unable to connect to the database:', error);
      process.exit(1);
    });
});

const app: Application = express();


app.use(cors({
  origin: (origin, callback) => callback(null, true),
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());




app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Library Management System API",
    documentation: "/api-docs",
    health: "/api/v1/health"
  });
});

app.use(`/api/v1`, apiRoutes);

app.use((req: express.Request, res: express.Response) => {
  ResponseHelper.notFound(res, "Route not found");
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  Logger.info(`Server is running on port ${PORT}`);
});

export default app;
