// create token and saving that in cookies
const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};


const generateResetToken = async () => {
  const token = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number
  const hash = await hashFunction(token.toString()); // Convert the number to a string and hash it
  return { token, hash };
};


const generateAccessToken = (user) => {
  const payload = {
    userId: user._id,
    name: user.name,
  };

  const options = {
    expiresIn: '50m',
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);

  //console.log('Generated Token:', token);

  return token;
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Auth Header:', authHeader); 

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('Invalid token: Token not found'); 
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decodedToken);
    req.user = decodedToken; 
    next(); 
  } catch (err) {
    console.log('Invalid token: Verification failed'); 
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { sendToken, verifyToken, generateAccessToken, generateResetToken};
