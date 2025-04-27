const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Define schema
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

 
const Admin = mongoose.model('Admin', adminSchema);

 
// const defaultAdmin = new Admin({
//   username: 'admin',
//   email:    'admin@gmail.com',
//   password: bcrypt.hashSync('admin', 10)  
// });

 
// defaultAdmin.save()
//   .then(() => console.log('✅ Admin user created successfully!'))
//   .catch((error) => console.error('❌ Error creating admin user:', error));
 
module.exports = Admin;
