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
exports.seedDatabase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../models");
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create seed users
        const saltRounds = 10;
        const demoPassword = yield bcryptjs_1.default.hash('password123', saltRounds);
        // Create demo users if they don't exist
        const adminExists = yield models_1.User.findOne({ where: { email: 'admin@cosmiclassroom.com' } });
        const studentExists = yield models_1.User.findOne({ where: { email: 'student@cosmiclassroom.com' } });
        const teacherExists = yield models_1.User.findOne({ where: { email: 'teacher@cosmiclassroom.com' } });
        if (!adminExists) {
            yield models_1.User.create({
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
            const student = yield models_1.User.create({
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
            yield models_1.QuestionHistory.create({
                userId: student.id,
                question: 'How far is Mars from Earth?',
                answer: 'The distance between Mars and Earth varies due to their elliptical orbits. At their closest (during opposition), they can be about 34 million miles (55 million kilometers) apart. At their farthest, they can be about 250 million miles (401 million kilometers) apart. The average distance between the two planets is about 140 million miles (225 million kilometers).',
                createdAt: new Date()
            });
            yield models_1.QuestionHistory.create({
                userId: student.id,
                question: 'What is a black hole?',
                answer: 'A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole. The boundary of the region from which no escape is possible is called the event horizon.',
                createdAt: new Date()
            });
            console.log('Student user created with sample question history');
        }
        if (!teacherExists) {
            yield models_1.User.create({
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
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
});
exports.seedDatabase = seedDatabase;
