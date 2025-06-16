const Admin = require('../models/adminModel');
const User = require('../models/userModel'); // إضافة نموذج المستخدم
const jwt = require('jsonwebtoken');

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newAdmin = new Admin({
      username,
      password
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      // التحقق من المستخدم (مشرف أو طالب)
      let user;
      if (decoded.role === 'student') {
        user = await User.findById(decoded.id).select('-password');
      } else {
        user = await Admin.findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        user: {
          id: user._id,
          username: user.username || user.email,
          role: decoded.role || 'admin'
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying token', error: error.message });
  }
};

// وظيفة تسجيل الطالب
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: 'student'
    });
    await newUser.save();

    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering student', error: error.message });
  }
};

// وظيفة تسجيل دخول الطالب
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const student = await User.findOne({ email, role: 'student' });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student._id, email: student.email, role: 'student' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      token,
      user: {
        id: student._id,
        email: student.email,
        role: student.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// تفعيل وظيفة إنشاء مشرف افتراضي
exports.createDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultAdmin = new Admin({
        username: 'admin',
        password: 'admin'
      });
      await defaultAdmin.save();
      console.log('Default admin created successfully');
    } else {
      console.log('Default admin already exists');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};