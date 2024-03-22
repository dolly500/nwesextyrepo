const User = require('../model/user');
const bcrypt = require('bcryptjs');

const resetPassword = async (userInfo) => {
    const { isEmailReceived } = await User.findOne({ email: userInfo.email });
    if (isEmailReceived === false) {
      throw new Error('Kindly visit your mail for the link sent for the password reset');
    }
    
    const hashedPassword = await bcrypt.hash(userInfo.password, 10);
    await User.findOneAndUpdate(
      { email: userInfo.email },
      { password: hashedPassword },
      { new: true }
    );
  
    return await User.findOneAndUpdate(
      { email: userInfo.email },
      { isEmailReceived: false },
      { new: true }
    );
};


const getUserByMail = async (email) => {
    const checkUser = await User.findOne({ email }).select('-password');
    if (!checkUser) {
      throw new ApiError(400, 'Oops! a user with this email does not exist...');
    }
  
    const token = await tokenService.generateAuthTokens(checkUser);
    const userToken = token.access.token;
    const verificationLink = `https://allsextoyss.vercel.app/api/v1/auth/confirm/email/${checkUser._id}?token=${checkUser._id}`;
  
    //ForgotPasswordMail(checkUser.email, verificationLink);
    return checkUser;
  };
  
module.exports = {
    resetPassword,
    getUserByMail

}