const express = require('express');
const { check, validationResult } = require('express-validator');
const dotenv = require('dotenv').config();
let User = require('../models/User');

const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//route Post api/users
//desc Add a user
//access public
router.post(
  '/',
  [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'Please enter valid email').isEmail(),
    check('password', 'password need to be at least 5 char').isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // if (!req.files || Object.keys(req.files).length === 0) {
    //   return res.status(400).send('No files were uploaded.');
    // }

    // const file = req.files.myFile;
    // const upath = 'public/uploads/' + file.name;

    try {
      let user1 = await User.findOne({ email: req.body.email });
      if (user1) {
        return res.status(400).json({ errors: 'User already exist' });
      }

      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
        // profileImage: file.name,
      });
      await newUser.save();

      const payload = {
        user: {
          id: newUser.id,
          name: newUser.name,
          // profileImage: newUser.profileImage,
        },
      };

      file.mv(upath, function (err) {
        if (err) return res.status(500).send(err);
      });

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