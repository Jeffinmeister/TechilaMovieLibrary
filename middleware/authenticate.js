const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }
  console.log(token,'token')
  console.log(process.env.SECRETKEY,'process.env.SECRET_KEY')
  jwt.verify(token, process.env.SECRETKEY, (err, user) => {
    if (err) {
        console.log(err,'errr')
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Unauthorized: Token expired' });
      } else {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
      }
    }

    req.user = user; // Attach the user object to the request for later use
    next();
  });
};

module.exports=authenticateToken