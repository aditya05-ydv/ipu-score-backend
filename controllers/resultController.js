const axios          = require('axios');
const crypto         = require('crypto');
const Subject        = require('../models/Subject');
const MissingSubject = require('../models/MissingSubject');

const IPU_BASE = 'https://examweb.ggsipu.ac.in/web';

// ── Helper: normalize code (remove dashes and spaces) ──
const normalizeCode = (code) => code?.trim().toUpperCase().replace(/[-\s]/g, '');

// ── Helper: encrypt password ──
const encryptPassword = (password, captcha) => {
  const combined = password + captcha;
  const hash     = crypto.createHash('sha256').update(combined).digest();
  return Buffer.from(hash).toString('base64');
};

// ── Helper: parse cookies ──
const parseCookies = (cookieArray) => {
  if (!cookieArray) return '';
  return cookieArray
    .map(cookie => cookie.split(';')[0])
    .join('; ');
};

// ══════════════════════════════════════════════
// 1. GET CAPTCHA
// GET /api/captcha
// ══════════════════════════════════════════════
const getCaptcha = async (req, res) => {
  try {
    const response = await axios.get(`${IPU_BASE}/CaptchaServlet`, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept':     'image/png,image/*',
      },
    });

    const cookies = parseCookies(response.headers['set-cookie']);
    req.session.ipuCookie = cookies;
    await new Promise((resolve) => req.session.save(resolve));

    console.log('CAPTCHA Request:', {
      ipuCookie: req.session.ipuCookie,
    });

    res.set('Content-Type', 'image/png');
    res.send(response.data);

  } catch (err) {
    console.error('getCaptcha error:', err.message);
    res.status(500).json({ error: 'Failed to fetch CAPTCHA from IPU server' });
  }
};

// ══════════════════════════════════════════════
// 2. LOGIN
// POST /api/login
// ══════════════════════════════════════════════
const login = async (req, res) => {
  const { username, password, captcha } = req.body;

  if (!username || !password || !captcha) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const encryptedPassword = encryptPassword(password, captcha.trim());
    const savedCookie       = req.session.ipuCookie || '';

    console.log('Login Request:', {
      username,
      encryptedPassword,
      captcha,
      savedCookie,
    });

    const response = await axios.post(
      `${IPU_BASE}/Login`,
      new URLSearchParams({
        username: username.trim(),
        passwd:   encryptedPassword,
        captcha:  captcha.trim(),
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cookie':        savedCookie,
          'User-Agent':   'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer':      `${IPU_BASE}/login.jsp`,
          'Origin':       'https://examweb.ggsipu.ac.in',
        },
        maxRedirects:   0,
        validateStatus: (status) => status < 400,
      }
    );

    const location   = response.headers['location'] || '';
    const newCookies = parseCookies(response.headers['set-cookie']);

    if (location.includes('studenthome')) {
      if (newCookies) req.session.ipuCookie = newCookies;
      await new Promise((resolve) => req.session.save(resolve));
      return res.json({ success: true });
    }

    return res.status(401).json({
      success: false,
      error:   'Invalid credentials or wrong CAPTCHA. Please try again.',
    });

  } catch (err) {
    console.error('login error:', err.message);
    res.status(500).json({ error: 'Login failed. IPU server may be down.' });
  }
};

// ══════════════════════════════════════════════
// 3. GET ALL RESULTS
// POST /api/result
// ══════════════════════════════════════════════
const getResult = async (req, res) => {
  try {
    const savedCookie = req.session.ipuCookie || '';

    if (!savedCookie) {
      return res.status(401).json({
        error: 'Session expired. Please login again.',
      });
    }

    const semesterPromises = Array.from({ length: 8 }, (_, i) =>
      axios.get(
        `${IPU_BASE}/StudentSearchProcess?flag=2&euno=${i + 1}`,
        {
          headers: {
            'Cookie':     savedCookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer':    `${IPU_BASE}/student/studenthome.jsp`,
            'Accept':     'application/json',
          },
        }
      ).catch(() => null)
    );

    const responses = await Promise.all(semesterPromises);

    let student      = null;
    const allResults = [];

    responses.forEach((response) => {
      if (
        response?.data &&
        response.data.stresult &&
        response.data.stresult.length > 0
      ) {
        if (!student) student = response.data.stprofile;
        allResults.push(...response.data.stresult);
      }
    });

    if (!student) {
      return res.status(404).json({
        error: 'No results found. Please check your credentials.',
      });
    }

    req.session.destroy();

    return res.json({
      success: true,
      student,
      results: allResults,
    });

  } catch (err) {
    console.error('getResult error:', err.message);
    res.status(500).json({
      error: 'Failed to fetch result. IPU server may be down.',
    });
  }
};

// ══════════════════════════════════════════════
// 4. GET CREDIT
// GET /api/credit/:code
// Fuzzy match: ES-101, ES101, ES 101 all match
// ══════════════════════════════════════════════
const getCredit = async (req, res) => {
  const raw        = req.params.code?.trim().toUpperCase();
  const normalized = raw.replace(/[-\s]/g, '');

  try {
    // Direct query using codeNormalized — fast! ⚡
    const subject = await Subject.findOne({ codeNormalized: normalized });

    if (subject) {
      return res.json({
        found:   true,
        code:    raw,
        credits: subject.credits,
        name:    subject.name,
        source:  'mongodb',
      });
    }

    // ── Not found → log it as missing ──
    console.warn(`[MISSING CREDIT] Code: ${raw} | Normalized: ${normalized}`);

    await MissingSubject.findOneAndUpdate(
      { code: normalized },
      {
        $inc: { count: 1 },
        $set: { lastSearched: new Date() },
        $setOnInsert: { code: normalized, name: '' },
      },
      { upsert: true, new: true }
    );

    return res.json({
      found:   false,
      code:    raw,
      credits: null,
      source:  'not_found',
    });

  } catch (err) {
    console.error('getCredit error:', err.message);
    return res.json({
      found:   false,
      code:    raw,
      credits: null,
      source:  'error',
    });
  }
};

module.exports = {
  getCaptcha,
  login,
  getResult,
  getCredit,
};