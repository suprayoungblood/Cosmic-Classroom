import bcrypt from 'bcryptjs';
import { User, QuestionHistory } from '../models';

export const seedDatabase = async () => {
  try {
    // Create seed users
    const saltRounds = 10;
    const demoPassword = await bcrypt.hash('password123', saltRounds);
    
    // Create demo users if they don't exist
    const adminExists = await User.findOne({ where: { email: 'admin@cosmiclassroom.com' } });
    const studentExists = await User.findOne({ where: { email: 'student@cosmiclassroom.com' } });
    const teacherExists = await User.findOne({ where: { email: 'teacher@cosmiclassroom.com' } });

    if (!adminExists) {
      await User.create({
        username: 'admin_user',
        email: 'admin@cosmiclassroom.com',
        password: demoPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        interests: ['astronomy', 'physics', 'space exploration'],
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      });
      console.log('Admin user created');
    }

    if (!studentExists) {
      const student = await User.create({
        username: 'space_student',
        email: 'student@cosmiclassroom.com',
        password: demoPassword,
        firstName: 'Student',
        lastName: 'Explorer',
        role: 'student',
        age: 12,
        interests: ['planets', 'stars', 'space missions'],
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'
      });
      
      // Add sample question history for the student
      await QuestionHistory.create({
        userId: student.id,
        question: 'How far is Mars from Earth?',
        answer: 'The distance between Mars and Earth varies due to their elliptical orbits. At their closest (during opposition), they can be about 34 million miles (55 million kilometers) apart. At their farthest, they can be about 250 million miles (401 million kilometers) apart. The average distance between the two planets is about 140 million miles (225 million kilometers).',
        createdAt: new Date()
      });
      
      await QuestionHistory.create({
        userId: student.id,
        question: 'What is a black hole?',
        answer: 'A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole. The boundary of the region from which no escape is possible is called the event horizon.',
        createdAt: new Date()
      });
      
      console.log('Student user created with sample question history');
    }

    if (!teacherExists) {
      await User.create({
        username: 'space_teacher',
        email: 'teacher@cosmiclassroom.com',
        password: demoPassword,
        firstName: 'Teacher',
        lastName: 'Astronomy',
        role: 'educator',
        interests: ['education', 'astronomy', 'space science'],
        profilePicture: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher'
      });
      console.log('Teacher user created');
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};