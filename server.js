/*const express      = require('express');
const cors         = require('cors');
const session      = require('express-session');
const dotenv       = require('dotenv');
const mongoose     = require('mongoose');
const resultRoutes = require('./routes/result');

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5177'],
  credentials: true,
  methods:     ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret:            'ipu-score-secret-key',
  resave:            true,
  saveUninitialized: true,
  cookie: {
    secure:   false,
    httpOnly: true,
    maxAge:   10 * 60 * 1000,
    sameSite: 'lax',
  },
}));

app.use('/api', resultRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'IPU Score Backend Running ✅' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
*/

const express      = require('express');
const cors         = require('cors');
const session      = require('express-session');
const MongoStore   = require('connect-mongo');
const dotenv       = require('dotenv');
const mongoose     = require('mongoose');
const resultRoutes = require('./routes/result');

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));

// ✅ FIXED CORS for production
app.use(cors({
  origin: ['http://localhost:5173', 'https://ipu-score-frontend.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Trust Proxy for Render/Heroku (required for secure cookies)
app.set('trust proxy', 1);

// ✅ Session setup (with MongoDB store for persistence)
app.use(session({
  secret: 'ipu-score-secret-key',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongoUrl: process.env.MONGODB_URI }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 10 * 60 * 1000,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
}));

// ✅ Routes
app.use('/api', resultRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.json({ status: 'IPU Score Backend Running ✅' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});