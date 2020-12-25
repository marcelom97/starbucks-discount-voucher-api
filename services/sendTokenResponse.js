/**
 * @description Get token from model, create cookie and send response
 * @param {User} user
 * @param {Number} statusCode
 * @param {Response} res
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();

  const accessOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
  };

  const refreshOptions = {
    expires: new Date(Date.now() + process.env.REFRESH_EXPIRE + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
  };

  if (process.env.NODE_ENV === 'production') {
    accessOptions.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, accessOptions)
    .cookie('refreshToken', refreshToken, refreshOptions)
    .json({
      success: true,
      token,
      refreshToken,
    });
};

module.exports = sendTokenResponse;
