// Load environment variables from .env file
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }
  
  const express = require('express');
  const cors = require('cors');

  const connectToDB = require('./config/connectToDB');
  const authController = require('./controllers/authController');

// Create an express app
const app = express();

// Configure express app
app.use(express.json());
app.use(cors());
  
  // Establish MongoDB connection
  connectToDB()
    .then(() => {
      const PORT = process.env.PORT || 5001;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to connect to MongoDB:', error.message);
    });
  

    // Route to login
app.post('/user-login', authController.loginUser);