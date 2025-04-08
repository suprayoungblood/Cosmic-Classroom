import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface QuestionHistoryAttributes {
  id: number;
  userId: number;
  question: string;
  answer: string;
  topic?: string;
  createdAt?: Date;
}

interface QuestionHistoryCreationAttributes extends Optional<QuestionHistoryAttributes, 'id'> {}

class QuestionHistory extends Model<QuestionHistoryAttributes, QuestionHistoryCreationAttributes> implements QuestionHistoryAttributes {
  public id!: number;
  public userId!: number;
  public question!: string;
  public answer!: string;
  public topic?: string;
  public readonly createdAt!: Date;
}

QuestionHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    modelName: 'QuestionHistory',
    tableName: 'question_history',
    timestamps: true,
    updatedAt: false
  }
);

export { QuestionHistory };