import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // Gracefully falls back if secret hasn't been set in .env yet
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev_secret_xyz123', {
    expiresIn: '7d',
  });
};

export default generateToken;
