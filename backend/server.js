// backend/server.js
import dotenv from 'dotenv';
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // For getting __dirname in ES Modules

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the .env file located in the same directory as server.js
dotenv.config({ path: path.resolve(__dirname, '.env') });

import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
// Ensure that process.env.MONGODB_URI is defined before connecting
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in the .env file.');
  // Exit or throw an error if the URI is critical for app function
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, minlength: 5, maxlength: 15 },
  password: { type: String, required: true }, // Store hashed password
  // Add other user fields as needed (e.g., email, creation date)
});

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// API Routes

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Basic server-side validation (can be expanded)
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please enter all fields.' });
    }
    if (username.length < 5 || username.length > 15 || !/^[a-zA-Z0-9]+$/.test(username)) {
        return res.status(400).json({ success: false, message: 'Username must be 5-15 characters long and contain only letters and numbers.' });
    }
    if (password.length < 8 || !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long and include letters, numbers, and one special character.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already taken.' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ success: true, message: 'Registration successful! Please login.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please enter all fields.' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid username or password.' });
    }

    // In a real app, you would generate and send a JWT here
    res.status(200).json({ success: true, message: 'Login successful!', user: { username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// Basic root route for testing if server is running
app.get('/', (req, res) => {
  res.send('Evalytics-AI Backend API is running!');
});

// New GET route for /api
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Evalytics-AI API! Available endpoints: /api/signup (POST), /api/login (POST)' });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
