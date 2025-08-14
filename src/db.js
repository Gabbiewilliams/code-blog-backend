import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    mongoose.set('strictQuery', true);

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'shortstack_db' // database name 
    });

    console.log('✅ MongoDB connected to shortstack_db');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

