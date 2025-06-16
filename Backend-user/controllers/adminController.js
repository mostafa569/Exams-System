const Exam = require('../models/examModel');
const Question = require('../models/questionModel');
const Result = require('../models/resultModel');

 
exports.getExams = async (req, res) => {
  try {
    
    const exams = await Exam.find().sort({ createdAt: -1 });
    
    res.status(200).json(exams);
  } catch (error) {
    console.error('Error in getExams:', error);
    res.status(500).json({ message: 'Error fetching exams', error: error.message });
  }
};

 
exports.getExamById = async (req, res) => {
  try {
    const { examId } = req.params;
    
    
    const exam = await Exam.findById(examId).populate('questions');
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
     
    res.status(200).json(exam);
  } catch (error) {
    
    res.status(500).json({ message: 'Error fetching exam', error: error.message });
  }
};

 
exports.createExam = async (req, res) => {
  try {
    const { examTitle, examDescription, duration } = req.body;
     
    
    const newExam = new Exam({
      examTitle,
      examDescription,
      duration
    });
    
    const savedExam = await newExam.save();
     
    res.status(201).json(savedExam);
  } catch (error) {
     
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
};

 
exports.editExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { examTitle, examDescription, duration } = req.body;
    
    
    const updatedExam = await Exam.findByIdAndUpdate(
      examId,
      { examTitle, examDescription, duration },
      { new: true, runValidators: true }
    );
    
    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
   
    res.status(200).json(updatedExam);
  } catch (error) {
     
    res.status(500).json({ message: 'Error updating exam', error: error.message });
  }
};

 
exports.deleteExam = async (req, res) => {
  try {
    const { examId } = req.params;
  
    
    
    const deletedExam = await Exam.findByIdAndDelete(examId);
    
    if (!deletedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    
    await Question.deleteMany({ examId });
    
    
    res.status(200).json({ message: 'Exam deleted successfully' });
  } catch (error) {
    
    res.status(500).json({ message: 'Error deleting exam', error: error.message });
  }
};

 
exports.getExamQuestions = async (req, res) => {
  try {
    const { examId } = req.params;
     
    
    const questions = await Question.find({ examId }).sort({ createdAt: -1 });
    
  
    res.status(200).json(questions);
  } catch (error) {
    
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};

 
exports.getQuestionById = async (req, res) => {
  try {
    const { questionId } = req.params;
    
    
    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
     
    res.status(200).json(question);
  } catch (error) {
    
    res.status(500).json({ message: 'Error fetching question', error: error.message });
  }
};

 
exports.createQuestion = async (req, res) => {
  try {
    const { examId, questionText, choices, correctAnswer } = req.body;
    
    
   
    const exam = await Exam.findById(examId);
    if (!exam) {
       
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    const newQuestion = new Question({
      examId,
      questionText,
      choices,
      correctAnswer: Number(correctAnswer)  
    });
    
    const savedQuestion = await newQuestion.save();
     res.status(201).json(savedQuestion);
  } catch (error) {
     res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

 exports.editQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { questionText, choices, correctAnswer } = req.body;
     
    
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { 
        questionText, 
        choices, 
        correctAnswer: Number(correctAnswer)  
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedQuestion) {
  
      return res.status(404).json({ message: 'Question not found' });
    }
    
     
    res.status(200).json(updatedQuestion);
  } catch (error) {
  
    res.status(500).json({ message: 'Error updating question', error: error.message });
  }
};

 
exports.deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
     
    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    
    if (!deletedQuestion) {
       return res.status(404).json({ message: 'Question not found' });
    }
    
     res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
  
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};

// Add this method to the adminController
exports.getExamResults = async (req, res) => {
  try {
    const { examId } = req.params;
    
    // Find all results for this exam
    const results = await Result.find({ examId })
      .populate('userId', 'name email') // Populate user details
      .sort({ dateTaken: -1 }); // Sort by most recent
    
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching exam results:', error);
    res.status(500).json({ message: 'Error fetching exam results', error: error.message });
  }
};

