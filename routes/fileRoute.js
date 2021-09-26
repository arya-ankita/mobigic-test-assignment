const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authController = require('../controllers/authController');

router.post('/upload', authController.protect, fileController.upload);
router.get('/list', authController.protect, fileController.fileShow);
router.delete('/deletefile', authController.protect, fileController.deletefile);

module.exports = router;