const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  examTitle:     { type: String, required: true },
  examDescription: { type: String, required: true },
  duration:      { type: Number, required: true }, // Duration in minutes
  questions:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] // Reference to the Question model
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);
