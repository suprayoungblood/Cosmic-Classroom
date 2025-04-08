"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../config/database"));
class User extends sequelize_1.Model {
    // Method to compare password for login
    comparePassword(candidatePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield bcryptjs_1.default.compare(candidatePassword, this.password);
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    profilePicture: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    interests: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: []
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'student'
    },
    age: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    // Game mechanics fields
    level: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Novice'
    },
    xp: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    dailyStreak: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    questionsAsked: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    topicsExplored: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    badges: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    },
    completedChallenges: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
        allowNull: true,
        defaultValue: []
    },
    lastActive: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    streakUpdatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    bio: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: 'Space enthusiast exploring the cosmos through Cosmic Classroom.'
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.default,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
});
// Add hooks
User.beforeCreate((user) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcryptjs_1.default.genSalt(10);
    user.password = yield bcryptjs_1.default.hash(user.password, salt);
}));
User.beforeUpdate((user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.changed('password')) {
        const salt = yield bcryptjs_1.default.genSalt(10);
        user.password = yield bcryptjs_1.default.hash(user.password, salt);
    }
}));
