"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionHistory = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class QuestionHistory extends sequelize_1.Model {
}
exports.QuestionHistory = QuestionHistory;
QuestionHistory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    question: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    answer: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false
    },
    topic: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.default,
    modelName: 'QuestionHistory',
    tableName: 'question_history',
    timestamps: true,
    updatedAt: false
});
