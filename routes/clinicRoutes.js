const express = require('express');
const {check, validationResult} = require('express-validator');

let Clinics = require('../models/Clinic');

const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

//route Get api/Clinics
//desc Get all Clinics
//access public
router.get('/', async (req, res) => {
  try {
    const ClinicDB = await Clinics.find();
    res.send(ClinicDB);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//route Get api/Clinics/:id
//desc Get Clinic by id
//access public
router.get('/:id', async (req, res) => {
  try {    
    const Clinic = await Clinics.findById(req.params.id);
    if (!Clinic) {
      return res.status(404).send('Clinic not found');
    }
    res.send(Clinic);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//route Post api/Clinics
//desc Add a Clinic
//access public
router.post(
  '/',   
  [
    check('name', 'name cannot be empty').not().isEmpty(),
    check('location', 'location cannot be empty').not().isEmpty(),
  ], 
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
      return res.status(400).json({errors: errors.array()});
    }
    const newClinic = await Clinics.create({      
      name: req.body.name,
      location: req.body.location,
      timings: req.body.timings,
      rating: req.body.rating
    });
    res.send(newClinic);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

//route Delete api/Clinics/
//desc delete Clinic by id
//access public
router.delete('/', async (req, res) => {
  //find the element
  try {
    const Clinic = await Clinics.findOneAndRemove({ _id: req.body.id });
    if (!Clinic) {
      return res.status(404).send('Clinic not found');
    }
    res.send('Clinic deleted');
  } catch (err) {
    res.status(500).send('server error');
  }
});

//route PUT api/Clinics/
//desc update Clinic by id
//access public
router.put('/', async (req, res) => {
  try {
    const Clinic = await Clinics.findById(req.body.id);

    if (!Clinic) {
      return res.status(404).send('Clinic not found');
    }

    Clinic.question = req.body.question;    
    Clinic.location = req.body.location;
    Clinic.timings = req.body.timings;
    Clinic.rating = req.body.rating;
        
    await Clinic.save();
    res.send(Clinic);
    
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
