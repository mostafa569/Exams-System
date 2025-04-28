const express = require("express");
const router = express.Router();
const { 
  adminLogin, 
  createExam, 
  editExam, 
  getExams, 
  getExamById, 
  deleteExam, 
  getExamQuestions, 
  getQuestionById, 
  editQuestion, 
  createQuestion, 
  deleteQuestion 
} = require("../controllers/adminController");
const { isAuthAdmin } = require("../middleware/isAuthAdmin");
 
router.post("/login", adminLogin);

 
router.get("/get-exams", isAuthAdmin, getExams);
router.get("/get-exam/:examId", isAuthAdmin, getExamById);
router.post("/create-exam", isAuthAdmin, createExam);
router.put("/edit-exam/:examId", isAuthAdmin, editExam);
router.delete("/delete-exam/:examId", isAuthAdmin, deleteExam);
 
router.get("/get-exam-questions/:examId", isAuthAdmin, getExamQuestions);
router.get("/get-question/:questionId", isAuthAdmin, getQuestionById);
router.put("/edit-question/:questionId", isAuthAdmin, editQuestion);
router.post("/create-question", isAuthAdmin, createQuestion);
router.delete("/delete-question/:questionId", isAuthAdmin, deleteQuestion);

module.exports = router;
