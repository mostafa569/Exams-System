const Admin = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const Exam = require("../models/examModel");
const Question = require("../models/questionModel");
const jwt = require("jsonwebtoken");

exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createExam = async (req, res) => {
  const { examTitle, examDescription, duration, questions } = req.body;

  try {
    const exam = new Exam({
      examTitle,
      examDescription,
      duration,
    });

    await exam.save();

    for (let questionData of questions) {
      const { questionText, choices, correctAnswer } = questionData;
      const question = new Question({
        examId: exam._id,
        questionText,
        choices,
        correctAnswer,
      });
      await question.save();
    }

    res.status(201).json({
      message: "Exam created successfully!",
      exam,
    });
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ message: "Error creating exam, please try again" });
  }
};

exports.editExam = async (req, res) => {
  const { examId } = req.params;
  const { examTitle, examDescription, duration, questions } = req.body;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    exam.examTitle = examTitle || exam.examTitle;
    exam.examDescription = examDescription || exam.examDescription;
    exam.duration = duration || exam.duration;

    await exam.save();

    if (questions && questions.length > 0) {
      await Question.deleteMany({ examId: exam._id });

      for (let questionData of questions) {
        const { questionText, choices, correctAnswer } = questionData;
        const question = new Question({
          examId: exam._id,
          questionText,
          choices,
          correctAnswer,
        });
        await question.save();
      }
    }

    res.status(200).json({
      message: "Exam and questions updated successfully!",
      exam,
    });
  } catch (error) {
    console.error("Error editing exam:", error);
    res.status(500).json({ message: "Error editing exam, please try again" });
  }
};

exports.deleteExam = async (req, res) => {
  const { examId } = req.params;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    await Question.deleteMany({ examId: exam._id });
    await exam.remove();

    res.status(200).json({
      message: "Exam deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting exam:", error);
    res.status(500).json({ message: "Error deleting exam, please try again" });
  }
};

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("questions").exec();
    res.status(200).json(exams);
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ message: "Error fetching exams" });
  }
};

exports.getExamById = async (req, res) => {
  const { examId } = req.params;

  try {
    const exam = await Exam.findById(examId).populate("questions").exec();
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.status(200).json(exam);
  } catch (error) {
    console.error("Error fetching exam:", error);
    res.status(500).json({ message: "Error fetching exam" });
  }
};

exports.getExamQuestions = async (req, res) => {
  const { examId } = req.params;

  try {
    const questions = await Question.find({ examId }).populate("examId").exec();
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching exam questions:", error);
    res.status(500).json({ message: "Error fetching exam questions" });
  }
};

exports.getQuestionById = async (req, res) => {
  const { questionId } = req.params;

  try {
    const question = await Question.findById(questionId).populate("examId").exec();
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Error fetching question" });
  }
};

exports.editQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { questionText, choices, correctAnswer } = req.body;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.questionText = questionText || question.questionText;
    question.choices = choices || question.choices;
    question.correctAnswer = correctAnswer || question.correctAnswer;

    await question.save();
    res.status(200).json({
      message: "Question updated successfully!",
      question,
    });
  } catch (error) {
    console.error("Error editing question:", error);
    res.status(500).json({ message: "Error editing question, please try again" });
  }
};

exports.createQuestion = async (req, res) => {
  const { examId, questionText, choices, correctAnswer } = req.body;

  try {
    const question = new Question({
      examId,
      questionText,
      choices,
      correctAnswer,
    });

    await question.save();

    res.status(201).json({
      message: "Question created successfully!",
      question,
    });
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Error creating question, please try again" });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { questionId } = req.params;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await question.remove();
    res.status(200).json({
      message: "Question deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: "Error deleting question, please try again" });
  }
};
