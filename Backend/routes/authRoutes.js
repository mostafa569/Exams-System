const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

 
 
router.post('/login', authController.loginAdmin);
router.post('/register', authController.registerAdmin);
router.get('/verify-token', authController.verifyToken);

 
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working' });
});

module.exports = router;


