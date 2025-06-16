const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAuthAdmin } = require('../middleware/isAuthAdmin');

router.get('/exams', isAuthAdmin, adminController.getExams);
router.get('/exams/:examId', isAuthAdmin, adminController.getExamById);
router.post('/exams', isAuthAdmin, adminController.createExam);
router.put('/exams/:examId', isAuthAdmin, adminController.editExam);
router.delete('/exams/:examId', isAuthAdmin, adminController.deleteExam);
router.get('/exams/:examId/questions', isAuthAdmin, adminController.getExamQuestions);
router.get('/questions/:questionId', isAuthAdmin, adminController.getQuestionById);
router.post('/questions', isAuthAdmin, adminController.createQuestion);
router.put('/questions/:questionId', isAuthAdmin, adminController.editQuestion);
router.delete('/questions/:questionId', isAuthAdmin, adminController.deleteQuestion);
router.get('/exams/:examId/results', isAuthAdmin, adminController.getExamResults);

module.exports = router;