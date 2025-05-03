const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
// const { createDefaultAdmin } = require('./controllers/authController');

dotenv.config();

 
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

 
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected...");
     
    // createDefaultAdmin();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

 
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
 

app.use((req, res) => {
  
  res.status(404).json({ message: "Route not found" });
});
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
 
});

module.exports = app;
