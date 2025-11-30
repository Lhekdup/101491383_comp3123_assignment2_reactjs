const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const userRouter = require('./routes/user');
const employeeRouter = require('./routes/employee');

const app = express();

// ====== Config ======
const SERVER_PORT = process.env.PORT || 3001;  // Backend on 3001 (React will use 3000)
const DB_URL =
  process.env.DB_URL || 'mongodb://mongo:27017/comp3123_assignment2';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// ====== Middleware ======
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: false
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====== Routes ======
app.use('/api/v1/user', userRouter);
app.use('/api/v1/emp', employeeRouter);

app.get('/', (req, res) => {
  res.send('<h1>COMP 3123 — Assignment 2 Backend</h1>');
});

// ====== MongoDB connection & server start ======
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    app.listen(SERVER_PORT, () => {
      console.log(`Server running on port ${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
