const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examTitle: { type: String, required: true },
  examDescription: { type: String, required: true },
  duration: { type: Number, required: true },
  // Add a virtual for questions
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Add a virtual property to get questions
examSchema.virtual('questions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'examId'
});

module.exports = mongoose.model('Exam', examSchema);