import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    // Strict generic validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    
    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid user data format' });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};
