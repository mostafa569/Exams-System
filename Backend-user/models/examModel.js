const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examTitle: {
    type: String,
    required: true,
    trim: true
  },
  examDescription: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
 
examSchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'examId'
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
