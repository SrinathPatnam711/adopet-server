const express = require('express');
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv').config();
let User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//route Get api/auth
//desc Get user data
//access public
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.send(user);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//route Post api/auth
//desc login
//access public
router.post(
  '/',
  [
    check('email', 'Please enter valid email').isEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: 'Please enter valid email' });
    }

    try {
      const { email, password } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: 'User does not exist' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ errors: 'Password incorrect' });
      }
      const payload = {
        user: {
          id: user.id,
          name: user.name,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
