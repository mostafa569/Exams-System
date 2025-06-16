const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/admin/login', authController.loginAdmin);
router.post('/admin/register', authController.registerAdmin);
router.post('/student/register', authController.registerStudent);
router.post('/student/login', authController.loginStudent);
router.get('/verify-token', authController.verifyToken);

module.exports = router;