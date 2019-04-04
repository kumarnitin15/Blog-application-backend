const express = require('express');
const router = express.Router();

const AuthHelper = require('../helpers/AuthHelper');
const ImageCntrl = require('../controllers/image');

router.post('/upload-image', AuthHelper.VerifyToken, ImageCntrl.UploadImage);

module.exports = router;