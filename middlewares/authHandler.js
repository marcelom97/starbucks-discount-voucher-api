const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Protect routes
const protectRoute = asyncHandler(async (req, res, next) => {
  let token = null;
  let refreshToken = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Set token from Bearer token in header
    /* eslint-disable-next-line */
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token && req.cookies.refreshToken) {
    // Set token from cookie
    token = req.cookies.token;
    refreshToken = req.cookies.refreshToken;
  }

  // Make sure token exists
  if (!token || !refreshToken) {
    return next(new ErrorResponse(`Not authorized to access route:${req.originalUrl}`, 401));
  }

  try {
    // Verify token
    const accessDecoded = jwt.verify(token, process.env.JWT_SECRET);
    // Verify refresh token
    const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    req.user = await User.findById(accessDecoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse(`Not authorized to access route:${req.originalUrl}`, 401));
  }
});

const authorizedUser = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
  }
  next();
};

module.exports = { protectRoute, authorizedUser };
