import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  interests: string[];
  role?: string;
  age?: number;
  // Game mechanics attributes
  level?: string;
  xp?: number;
  dailyStreak?: number;
  questionsAsked?: number;
  topicsExplored?: number;
  badges?: string[];
  completedChallenges?: number[];
  lastActive?: Date;
  streakUpdatedAt?: Date;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'level' | 'xp' | 'dailyStreak' | 'questionsAsked' | 'topicsExplored' | 'badges' | 'completedChallenges' | 'lastActive' | 'streakUpdatedAt' | 'bio'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public profilePicture!: string;
  public interests!: string[];
  public role!: string;
  public age!: number;
  // Game mechanics fields
  public level!: string;
  public xp!: number;
  public dailyStreak!: number;
  public questionsAsked!: number;
  public topicsExplored!: number;
  public badges!: string[];
  public completedChallenges!: number[];
  public lastActive!: Date;
  public streakUpdatedAt!: Date;
  public bio!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Method to compare password for login
  async comparePassword(candidatePassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      return false;
    }
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    interests: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'student'
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // Game mechanics fields
    level: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Novice'
    },
    xp: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    dailyStreak: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    questionsAsked: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    topicsExplored: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    badges: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      defaultValue: []
    },
    completedChallenges: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: []
    },
    lastActive: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    streakUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Space enthusiast exploring the cosmos through Cosmic Classroom.'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
  }
);

// Add hooks
User.beforeCreate(async (user: User) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user: User) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

export { User, UserAttributes };