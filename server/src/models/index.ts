import sequelize from '../config/database';
import { User } from './User';
import { QuestionHistory } from './QuestionHistory';

// Define associations after models are loaded - wrapped in try/catch to prevent circular dependencies
try {
  User.hasMany(QuestionHistory, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'questionHistory'
  });

  QuestionHistory.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
} catch (error) {
  console.warn('Error setting up associations:', error);
}

export {
  User,
  QuestionHistory
};

export default sequelize;