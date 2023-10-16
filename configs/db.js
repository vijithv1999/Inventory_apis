// db.js
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config() 

const MONGO_URI =process.env.MONO_URL

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to database');
});

db.on('error', (error) => {
  console.error('Database connection error:', error);
});


export default db