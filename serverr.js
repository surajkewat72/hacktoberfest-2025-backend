//Secure User Authentication System using Express.js and Bcrypt

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const User = require('./models/User');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);

app.post('/api/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password || password.length < 8) {
      return res.status(400).json({ message: 'username, email and password (min 8 chars) required' });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'User with that email or username already exists' });
    }
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({ username, email, passwordHash });
    await user.save();
    res.status(201).json({ message: 'User created', user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', authLimiter, async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: 'Provide emailOrUsername and password' });
    }
    const user = await User.findOne({
      $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }]
    });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = { id: user._id.toString(), username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
    res.json({ message: 'Authenticated', token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/logout', (req, res) => {
  res.json({ message: 'Logout on client by deleting the token. For server-side logout, implement token revocation/blacklist.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
