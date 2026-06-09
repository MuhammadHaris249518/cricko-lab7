const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const { success, error } = require('../utils/apiResponse');

const JWT_SECRET  = process.env.JWT_SECRET || 'cricko_dev_secret_change_in_prod';
const JWT_EXPIRES = '7d';

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, age, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return error(res, 'An account with this email already exists.', 409);

    const hashed = await bcrypt.hash(password, 12);
    const user   = await User.create({ firstName, lastName, age, email, password: hashed });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return success(res, {
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
    }, 'Account created successfully.', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return error(res, 'Invalid email or password.', 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return error(res, 'Invalid email or password.', 401);

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    return success(res, {
      token,
      user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
    }, 'Login successful.');
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
