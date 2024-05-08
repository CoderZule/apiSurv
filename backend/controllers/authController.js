const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

function generateRandomString(length) {
  return crypto.randomBytes(length).toString('hex');
  }
async function loginUser(req, res) {
    const { Email, Password } = req.body;
    const jwtSecret = generateRandomString(32);

    if (!jwtSecret) {
      console.error('JWT secret key is missing.');
      return res.status(500).json({ message: 'Internal server error' });
    }
  
  
    try {
      const user = await User.findOne({ Email });
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const isMatch = await bcrypt.compare(Password, user.Password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

   
      const currentUser = {
        Firstname: user.Firstname,
        Lastname: user.Lastname,
        Cin: user.Cin,
        Email: user.Email,
        Role: user.Role,
        _id: user._id
      };
  
  
      res.json({ token, currentUser });
  
  
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }


module.exports = {
     loginUser: loginUser,
 
  }