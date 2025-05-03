// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// // تحميل متغيرات البيئة
// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // طباعة معلومات التصحيح للطلبات
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   console.log('Headers:', req.headers);
//   if (req.body && Object.keys(req.body).length > 0) {
//     console.log('Body:', req.body);
//   }
//   next();
// });

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);

// // اختبار المسار
// app.get('/api/test', (req, res) => {
//   res.json({ message: 'API is working' });
// });

// // اتصال بقاعدة البيانات
// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/exam-system';

// mongoose.connect(MONGO_URI)
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch(err => {
//     console.error('MongoDB connection error:', err);
//   });