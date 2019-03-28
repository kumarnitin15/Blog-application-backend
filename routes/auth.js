const express = require('express');
const router = express.Router();

const AuthCntrl = require('../controllers/auth');

router.post('/register', AuthCntrl.CreateUser);
router.post('/login', AuthCntrl.LoginUser);

module.exports = router;