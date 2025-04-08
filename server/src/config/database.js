"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const env_1 = require("./env");
// Create Sequelize instance
const sequelize = new sequelize_1.Sequelize(env_1.ENV.DB_NAME, env_1.ENV.DB_USER, env_1.ENV.DB_PASSWORD, {
    host: env_1.ENV.DB_HOST,
    port: env_1.ENV.DB_PORT,
    dialect: 'postgres',
    logging: env_1.ENV.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
exports.default = sequelize;
