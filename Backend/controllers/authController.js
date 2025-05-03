const Admin = require('../models/adminModel');
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
    
    // إنشاء مسؤول جديد
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
      
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
      
      res.status(200).json({
        admin: {
          id: admin._id,
          username: admin.username
        }
      });
    });
  } catch (error) {
 
    res.status(500).json({ message: 'Error verifying token', error: error.message });
  }
};

 
// exports.createDefaultAdmin = async () => {
//   try {
//     const adminCount = await Admin.countDocuments();
//     if (adminCount === 0) {
//       const defaultAdmin = new Admin({
//         username: 'admin',
//         password: 'admin'
//       });
      
//       await defaultAdmin.save();
     
//     }
//   } catch (error) {
//     console.error('Error creating default admin:', error);
//   }
// };


