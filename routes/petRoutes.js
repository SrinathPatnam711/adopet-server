const express = require('express');
const { check, validationResult } = require('express-validator')

let Pet = require('../models/Pet')
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

//route Get api/cars
//desc Get all cars
//access public
router.get(
  '/',
  async (req, res) => {
    try {
      // const petDB= await Pet.find({user:req.user.id});
      const petDB = await Pet.find();
      // console.log(petDB);
      res.send(petDB)
    } catch (error) {
      res.status(500).send(error)
    }
  });

//route Get api/cars/:id
//desc Get car by id
//access public
router.get('/:id', async (req, res) => {

  try {
    const findPet = await Pet.findById(req.params.id);
    if (!findPet) {
      return res.status(404).send('Pet not found');
    } else {
      res.send(findPet);
    }
  } catch (error) {
    res.status(500).send('Server Error')
  }
});

//route Post api/cars
//desc Add a car
//access public
router.post(
  '/',
  authMiddleware,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('count', 'Enter valid count').isInt({ min: 0 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        consolelog("error 1");
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.files || Object.keys(req.files).length === 0) {       
        console.log("error image");
        res.status(400).send('No image uploaded.');
        return;
      }

      const file = req.files.myFile;
      const upath = 'public/uploads/' + file.name;

      const newPet = await Pet.create({
        user: req.user.id,
        name: req.body.name,
        description: req.body.description,
        dob: req.body.dob,
        breed: req.body.breed,
        petType: req.body.petType,
        count: req.body.count,
        vaccine: req.body.vaccine,
        petImage:file.name
      })

      file.mv(upath, function (err) {
        if (err) return res.status(500).send(err);
      });      
    } catch (error) {      
      return res.status(500).json({ error: 'error' });
    }
    res.send('New pet added');
  });

//route Delete api/cars/
//desc delete cars by id
//access public
router.delete(
  '/:id',
  authMiddleware,
  async (req, res) => {
    try {
      const delPet = await Pet.findOneAndRemove({ _id: req.params.id ,user:req.user.id});
      if (!delPet) {
        return res.status(404).json({errors:'OOPS!!!You are not allowed to delete this pet'});
      } else {
        res.json({success:"Pet deleted"});
      }
    } catch (error) {
      res.status(500).json({errors:'Server Error'})
    }
  });

//route PUT api/cars/
//desc update todo by id
//access public
router.put(
  '/',
  authMiddleware,
  async (req, res) => {
    //find the element
    try {
      const updatePet = await Pet.findOne({_id:req.body.id,user:req.user.id})
      if (!updatePet) {
        return res.status(400).json({errors:'OOPS!!!You are not allowed to edit this pet'});
      }
      console.log("Req- "+req.user.id);
      console.log(updatePet._id);
      

      console.log(updatePet);
      updatePet.name = req.body.name;
      updatePet.description = req.body.description;
      updatePet.dob = req.body.dob;
      updatePet.breed = req.body.breed;
      updatePet.petType = req.body.petType;
      updatePet.count = req.body.count;
      updatePet.vaccine = req.body.vaccine;

      await updatePet.save();
      res.send(updatePet);
    } catch (error) {
      return res.status(500).json({ errors: error.message });
    }

  });

module.exports = router;
