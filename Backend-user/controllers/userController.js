const Exam = require('../models/examModel');
const Question = require('../models/questionModel');
const Result = require('../models/resultModel');

exports.getAvailableExams = async (req, res) => {
  try {
    const exams = await Exam.find().select('examTitle examDescription duration createdAt').sort({ createdAt: -1 });
    res.status(200).json(exams);
  } catch (error) {
    console.error('Error in getAvailableExams:', error);
    res.status(500).json({ message: 'Error fetching exams', error: error.message });
  }
};

exports.getExamDetails = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId).populate('questions', 'questionText choices');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.status(200).json(exam);
  } catch (error) {
    console.error('Error in getExamDetails:', error);
    res.status(500).json({ message: 'Error fetching exam', error: error.message });
  }
};

exports.submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body; // [{ questionId, selectedAnswer }]
    const userId = req.user.id; // من التوكن عبر middleware

    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    let score = 0;
    const totalQuestions = exam.questions.length;
    const correctAnswers = exam.questions.map(q => ({
      questionId: q._id,
      correctAnswer: q.correctAnswer
    }));

    answers.forEach(answer => {
      const correct = correctAnswers.find(ca => ca.questionId.toString() === answer.questionId);
      if (correct && correct.correctAnswer === answer.selectedAnswer) {
        score += 1;
      }
    });

    const result = new Result({
      userId,
      examId,
      answers,
      score,
      dateTaken: new Date()
    });
    await result.save();

    res.status(200).json({ message: 'Exam submitted successfully', score, totalQuestions });
  } catch (error) {
    console.error('Error in submitExam:', error);
    res.status(500).json({ message: 'Error submitting exam', error: error.message });
  }
};

exports.getStudentResults = async (req, res) => {
  try {
    const userId = req.user.id;
    const results = await Result.find({ userId })
      .populate('examId', 'examTitle')
      .select('examId score dateTaken')
      .sort({ dateTaken: -1 });
    res.status(200).json(results);
  } catch (error) {
    console.error('Error in getStudentResults:', error);
    res.status(500).json({ message: 'Error fetching results', error: error.message });
  }
};

// وظيفة جديدة متوافقة مع هيكلية resultModel.js
exports.submitExamWithResultFormat = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body; // [{ questionId, selectedAnswer }]
    const userId = req.user.id;

    const exam = await Exam.findById(examId).populate('questions');
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    let score = 0;
    const totalQuestions = exam.questions.length;
    const formattedAnswers = answers.map(answer => {
      const question = exam.questions.find(q => q._id.toString() === answer.questionId);
      const isCorrect = question && question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) score += 1;
      return {
        questionId: answer.questionId,
        selected: answer.selectedAnswer.toString(),
        isCorrect
      };
    });

    const result = new Result({
      userId,
      examId,
      score,
      answers: formattedAnswers,
      dateTaken: new Date()
    });
    await result.save();

    res.status(200).json({ message: 'Exam submitted successfully', score, totalQuestions });
  } catch (error) {
    console.error('Error in submitExamWithResultFormat:', error);
    res.status(500).json({ message: 'Error submitting exam', error: error.message });
  }
};