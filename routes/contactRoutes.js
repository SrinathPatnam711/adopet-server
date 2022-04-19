const express = require("express");

// const authMiddleware = require('../middlewares/authMiddleware');

let Contact = require("../models/contactModels");

const uuid = require("uuid");

const router = express.Router();

const { check, validationResult } = require("express-validator");

// get all feedback
router.get("/", async (req, res) => {
  try {
    const contactDB = await Contact.find();
    res.send(contactDB);
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

//Post..send contact
router.post(
  "/",

  [
    check("name", "name is required").not().isEmpty(),
    check("email", "type need to be 6 char or more").isLength({
      min: 4,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const newContact = await Contact.create({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
      });
      res.send(newContact);
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
);

//delllete
router.delete("/", async (req, res) => {
  try {
    const contact = await Contact.findOneAndRemove({ _id: req.body.id });
    if (!contact) {
      return res.status(404).send("contact not found");
    }

    res.send("contact deleted");
  } catch (err) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
