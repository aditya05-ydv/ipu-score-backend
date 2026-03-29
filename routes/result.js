const express = require('express');
const router  = express.Router();
const {
  getCaptcha,
  login,
  getResult,
  getCredit,
} = require('../controllers/resultController');

// ── IPU Portal ──
router.get('/captcha',      getCaptcha);
router.post('/login',       login);
router.post('/result',      getResult);

// ── Credits MongoDB ──
router.get('/credit/:code', getCredit);

module.exports = router;