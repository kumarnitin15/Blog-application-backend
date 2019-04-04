const express = require('express');
const router = express.Router();

const AuthHelper = require('../helpers/AuthHelper');
const AuthCntrl = require('../controllers/auth');

router.post('/register', AuthCntrl.CreateUser);
router.post('/login', AuthCntrl.LoginUser);
router.post('/change-password', AuthHelper.VerifyToken, AuthCntrl.ChangePassword);

module.exports = router;