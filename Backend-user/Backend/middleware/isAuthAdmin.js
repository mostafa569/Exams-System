const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');

exports.isAuthAdmin = async (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const token = authHeader.split(' ')[1];
     
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
   
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', async (err, decoded) => {
      if (err) {
    
        return res.status(401).json({ message: 'Token is not valid' });
      }
      
      try {
         
        const admin = await Admin.findById(decoded.id);
        if (!admin) {
           
          return res.status(401).json({ message: 'Admin not found' });
        }
        
        req.admin = {
          id: admin._id,
          username: admin.username
        };
    
        next();
      } catch (error) {
        
        res.status(500).json({ message: 'Server error' });
      }
    });
  } catch (error) {
    
    res.status(500).json({ message: 'Server error' });
  }
};
