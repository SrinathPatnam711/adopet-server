const express = require("express");

// const authMiddleware = require('../middlewares/authMiddleware');

let Response = require("../models/Response");

const uuid = require("uuid");

const router = express.Router();

const { check, validationResult } = require("express-validator");

router.post(
  "/",

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newResponse = await Response.create({
        response: req.body.response,
      });
      res.send(newResponse);
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
);

// get all feedback
router.get("/", async (req, res) => {
  try {
    const ResponseDB = await Response.find();
    res.send(ResponseDB);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
