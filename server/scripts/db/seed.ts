// Database Seed Script — creates sample data for development
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

import { UserModel } from '../../src/infrastructure/database/mongoose/schemas/UserSchema';
import { TodoModel } from '../../src/infrastructure/database/mongoose/schemas/TodoSchema';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern-todo');
    console.log('Connected to MongoDB');

    // Clear existing data
    await UserModel.deleteMany({});
    await TodoModel.deleteMany({});
    console.log('Cleared existing data');

    // Create demo user
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = await UserModel.create({
      name: 'Demo User',
      email: 'demo@example.com',
      passwordHash,
      role: 'user',
    });
    console.log('Created demo user: demo@example.com / password123');

    // Create sample todos
    const todos = await TodoModel.insertMany([
      { title: 'Learn Clean Architecture', description: 'Understand domain, application, infrastructure layers', priority: 'high', userId: user._id },
      { title: 'Build REST API', description: 'Create Express routes with JWT auth', priority: 'high', userId: user._id, completed: true },
      { title: 'Add React Frontend', description: 'Build UI with React + Vite', priority: 'medium', userId: user._id },
      { title: 'Write Unit Tests', description: 'Test use cases and entities', priority: 'low', userId: user._id },
      { title: 'Deploy to Production', description: 'Deploy to Render or Railway', priority: 'low', userId: user._id },
    ]);
    console.log(`Created ${todos.length} sample todos`);

    await mongoose.connection.close();
    console.log('Done! Seed completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
