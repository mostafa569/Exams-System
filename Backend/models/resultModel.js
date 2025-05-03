const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  score:    { type: Number, required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      selected:   { type: String, required: true },
      isCorrect:  { type: Boolean, required: true }
    }
  ],
  dateTaken: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);
