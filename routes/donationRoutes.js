const express = require('express');
const {check, validationResult} = require('express-validator');

let Donations = require('../models/Donation');

const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

//route Get api/Donations
//desc Get all Donations
//access public
router.get('/', async (req, res) => {
  try {
    const DonationDB = await Donations.find();
    res.send(DonationDB);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//route Get api/Donations/:id
//desc Get Donation by id
//access public
router.get('/:id', async (req, res) => {
  try {    
    const Donation = await Donations.findById(req.params.id);
    if (!Donation) {
      return res.status(404).send('Donation not found');
    }
    res.send(Donation);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//route Post api/Donations
//desc Add a Donation
//access public
router.post(
  '/',   
  [
    check('name', 'name cannot be empty').not().isEmpty(),
    check('email', 'email cannot be empty').not().isEmpty(),
    check('CreditCard', 'CreditCard cannot be empty').not().isEmpty(),
    check('Donation', 'Donation cannot be empty').not().isEmpty(),
  ], 
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
      return res.status(400).json({errors: errors.array()});
    }
    const newDonation = await Donations.create({      
      name: req.body.name,
      email: req.body.email,
      CreditCard: req.body.CreditCard,
      Donation: req.body.Donation
    });
    res.send(newDonation);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

//route Delete api/Donations/
//desc delete Donation by id
//access public
router.delete('/', async (req, res) => {
  //find the element
  try {
    const Donation = await Donations.findOneAndRemove({ _id: req.body.id });
    if (!Donation) {
      return res.status(404).send('Donation not found');
    }
    res.send('Donation deleted');
  } catch (err) {
    res.status(500).send('server error');
  }
});

//route PUT api/Donations/
//desc update Donation by id
//access public
router.put('/', async (req, res) => {
  try {
    const Donation = await Donations.findById(req.body.id);

    if (!Donation) {
      return res.status(404).send('Donation not found');
    }

    Donation.name = req.body.name;    
    Donation.email = req.body.email;
    Donation.CreditCard = req.body.CreditCard;
    Donation.Donation = req.body.Donation;
        
    await Donation.save();
    res.send(Donation);
    
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
