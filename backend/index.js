const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bundlehub';
const jwtSecret = process.env.JWT_SECRET || 'bundlehub-dev-secret';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    provider: { type: String, default: 'email' },
    photoURL: { type: String, default: null },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

let mongoReady = false;

function createSession(user) {
  return {
    uid: user._id.toString(),
    displayName: user.displayName,
    email: user.email,
    provider: user.provider,
    photoURL: user.photoURL || null,
    token: jwt.sign(
      {
        sub: user._id.toString(),
        email: user.email,
        provider: user.provider,
      },
      jwtSecret,
      { expiresIn: '7d' }
    ),
  };
}

function requireMongo(req, res, next) {
  if (!mongoReady) {
    return res.status(503).json({
      error: 'MongoDB is not connected. Check your Compass/connection string and start MongoDB.',
    });
  }

  return next();
}

function getBearerToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

function authRequired(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Missing auth token.' });
  }

  try {
    req.auth = jwt.verify(token, jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired auth token.' });
  }
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mongoReady });
});

app.post('/api/auth/signup', requireMongo, async (req, res) => {
  try {
    const displayName = String(req.body.displayName || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!displayName) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ displayName, email, passwordHash, provider: 'email' });

    return res.status(201).json({ user: createSession(user) });
  } catch (error) {
    return res.status(500).json({ error: 'Could not create account.', details: error.message });
  }
});

app.post('/api/auth/login', requireMongo, async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email.' });
    }

    const isMatch = user.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password.' });
    }

    return res.json({ user: createSession(user) });
  } catch (error) {
    return res.status(500).json({ error: 'Could not sign in.', details: error.message });
  }
});

app.get('/api/auth/me', authRequired, requireMongo, async (req, res) => {
  try {
    const user = await User.findById(req.auth.sub);
    if (!user) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    return res.json({ user: createSession(user) });
  } catch (error) {
    return res.status(500).json({ error: 'Could not load session.', details: error.message });
  }
});

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }

  return res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

mongoose
  .connect(mongoUri)
  .then(() => {
    mongoReady = true;
    console.log(`Connected to MongoDB at ${mongoUri}`);
  })
  .catch(error => {
    mongoReady = false;
    console.warn('MongoDB connection failed. Auth routes will return 503 until the database is available.');
    console.warn(error.message);
  });

app.listen(port, () => {
  console.log(`BundleHub running at http://localhost:${port}`);
});