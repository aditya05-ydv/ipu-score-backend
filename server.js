const express      = require('express');
const cors         = require('cors');
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

// ✅ CORS — allow frontend origin with credentials
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5177',
    'http://localhost:5178',
    process.env.FRONTEND_URL || 'https://ipu-score-frontend.vercel.app',
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes
app.use('/api', resultRoutes);

// ✅ Health check
app.get('/', (req, res) => {
  res.json({ status: 'IPU Score Backend Running ✅' });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});