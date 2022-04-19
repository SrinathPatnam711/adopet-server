const express = require("express");

// const authMiddleware = require('../middlewares/authMiddleware');

let Feedback = require("../models/Feedback");

const uuid = require("uuid");

const router = express.Router();

const { check, validationResult } = require("express-validator");

// get all feedback
router.get("/", async (req, res) => {
  try {
    const feedbackDB = await Feedback.find();
    res.send(feedbackDB);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//Post..send feedback
router.post(
  "/",

  [
    check("name", "name is required").not().isEmpty(),
    check("email", "type need to be 6 char or more").isLength({
      min: 4,
    }),
    // check("feedback", "feedback is required").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newFeedback = await Feedback.create({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        feedback: req.body.feedback,
      });
      res.send(newFeedback);
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
);

//delllete
router.delete("/", async (req, res) => {
  try {
    const feedback = await Feedback.findOneAndRemove({ _id: req.body.id });
    if (!feedback) {
      return res.status(404).send("feedback not found");
    }

    res.send("feedback deleted");
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
