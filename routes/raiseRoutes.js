const express = require('express');
const {check,validationResult}= require ('express-validator')

let Raise = require('../models/Raise')
const authMiddleware=require('../middlewares/authMiddleware');
const router = express.Router();

//route Get api/raise
//desc Get all raise
//access public
router.get(
  '/',

 async (req, res) => {
    try {      
         const raise= await Raise.find();
       // console.log(raise);
        res.send(raise);
    } catch (error) {
        res.status(500).send('server error');
    }  
});

//route Get api/raise/:id
//desc Get raise by id
//access public
router.get('/:id', async(req, res) => {
  
    try {
        const findRaise= await Raise.findById(req.params.id);
        if (!findRaise) {
            return res.status(404).send('Raise not found');
          } else {
            res.send(findRaise);
          }
    } catch (error) {
        res.status(500).send('Server Error')
    }   
});

//route Post api/raise
//desc Add a raise
//access public
router.post(
  '/',
 authMiddleware,
  [
    check('title','Title is required').not().isEmpty(),
    check('description','Description need to be at least 30 chars').isLength({ min: 30, }),
] , 
  async(req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()});
    }
      const newRaise = await Raise.create({
        user:req.user.id,
        title: req.body.title,
        description: req.body.description,
       })
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ error:'server error' });
  }
 res.send('New Raise added');
});

//route Delete api/raise/
//desc delete raise by id
//access public
router.delete(
  '/:id', 
  authMiddleware,
  async(req, res) => {
    try {      
        const delRaise= await Raise.findOneAndRemove({_id: req.params.id});
        if (!delRaise) {
            return res.status(404).send('Raise not found');
          } else {
            res.send("Raise deleted");
          }
    } catch (error) {
        res.status(500).send('Server Error')
    } 
});

//route PUT api/raise/
//desc update raise by id
//access public
router.put(
  '/',
  authMiddleware, 
  async(req, res) => {
  //find the element
try {
    const updateRaise =await Raise.findById(req.body.id)
    if (!updateRaise) {
        return res.status(404).send('Raise not found');
      }   
      //console.log(updateRaise);
      updateRaise.title= req.body.title;
      updateRaise.description= req.body.description;
            
      await updateRaise.save();
      res.send (updateRaise);    
} catch (error) {
  return res.status(500).json({ error: error.message });
}
  
});

module.exports = router;