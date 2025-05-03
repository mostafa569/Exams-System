const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  examId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  choices: {
    type: [String],
    required: true,
    validate: [
      {
        validator: function(choices) {
          return choices.length >= 2;
        },
        message: 'Question must have at least 2 choices'
      }
    ]
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
