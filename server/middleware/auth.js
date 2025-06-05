const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  // 1) Get token from header
  const token = req.header('x-auth-token');

  // 2) Check if no token
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied' 
    });
  }

  try {
    // 3) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4) Check if user still exists
    const currentUser = await User.findById(decoded.user.id);
    if (!currentUser) {
      return res.status(401).json({ 
        success: false,
        message: 'The user belonging to this token no longer exists' 
      });
    }

    // 5) Check if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ 
        success: false,
        message: 'User recently changed password. Please log in again' 
      });
    }

    // 6) Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};