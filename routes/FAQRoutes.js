const express = require('express');
//const uuid = require('uuid');
const {check, validationResult} = require('express-validator');

let FAQS = require('../models/FAQS');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

//route Get api/FAQS
//desc Get all FAQS
//access public
router.get('/', async (req, res) => {
  try {
    const FAQDB = await FAQS.find();
    res.send(FAQDB);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//route Get api/FAQS/:id
//desc Get FAQ by id
//access public
router.get('/:id', async (req, res) => {
  try {    
    const FAQ = await FAQS.findById(req.params.id);
    if (!FAQ) {
      return res.status(404).send('FAQ not found');
    }
    res.send(FAQ);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//route Post api/FAQS
//desc Add a FAQ
//access public
router.post(
  '/',   
  [
    check('question', 'Question cannot be empty').not().isEmpty(),
    check('answer', 'Answer cannot be empty').not().isEmpty(),
  ], 
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
      return res.status(400).json({errors: errors.array()});
    }
    const newFAQ = await FAQS.create({
      //user: req.user.id,
      question: req.body.question,
      answer: req.body.answer
    });
    res.send(newFAQ);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

//route Delete api/FAQS/
//desc delete FAQ by id
//access public
router.delete('/', async (req, res) => {
  //find the element
  try {
    const FAQ = await FAQS.findOneAndRemove({ _id: req.body.id });
    if (!FAQ) {
      return res.status(404).send('FAQ not found');
    }
    res.send('FAQ deleted');
  } catch (err) {
    res.status(500).send('server error');
  }
});

//route PUT api/FAQS/
//desc update FAQ by id
//access public
router.put('/', authMiddleware, async (req, res) => {
  try {
    const FAQ = await FAQS.findById(req.body.id);

    if (!FAQ) {
      return res.status(404).send('FAQ not found');
    }

    FAQ.question = req.body.question;
    FAQ.answer = req.body.answer;    
    await FAQ.save();
    res.send(FAQ);
    
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
