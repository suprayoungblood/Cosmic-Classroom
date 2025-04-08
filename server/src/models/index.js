"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionHistory = exports.User = void 0;
const database_1 = __importDefault(require("../config/database"));
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const QuestionHistory_1 = require("./QuestionHistory");
Object.defineProperty(exports, "QuestionHistory", { enumerable: true, get: function () { return QuestionHistory_1.QuestionHistory; } });
// Define associations after models are loaded - wrapped in try/catch to prevent circular dependencies
try {
    User_1.User.hasMany(QuestionHistory_1.QuestionHistory, {
        sourceKey: 'id',
        foreignKey: 'userId',
        as: 'questionHistory'
    });
    QuestionHistory_1.QuestionHistory.belongsTo(User_1.User, {
        foreignKey: 'userId',
        as: 'user'
    });
}
catch (error) {
    console.warn('Error setting up associations:', error);
}
exports.default = database_1.default;
