const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthStudent } = require('../middleware/isAuthStudent');

router.get('/exams', isAuthStudent, userController.getAvailableExams);
router.get('/exams/:examId', isAuthStudent, userController.getExamDetails);
router.post('/exams/:examId/submit', isAuthStudent, userController.submitExamWithResultFormat); // استخدام الوظيفة الجديدة
router.get('/results', isAuthStudent, userController.getStudentResults);

module.exports = router;