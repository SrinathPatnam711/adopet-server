const express = require('express');
const {check,validationResult}= require ('express-validator')

let Events = require('../models/Events')
const authMiddleware=require('../middlewares/authMiddleware');
const router = express.Router();

//route Get api/event
//desc Get all event
//access public
router.get(
  '/',
authMiddleware,
 async (req, res) => {
    try {      
         const event= await Events.find();
       res.send(event);
    } catch (error) {
        res.status(500).send('server error');
    }
  
});

//route Get api/raise/:id
//desc Get raise by id
//access public
router.get('/:id', async(req, res) => {
  
    try {
        const findEvent= await Events.findById(req.params.id);
        if (!findEvent) {
            return res.status(404).send('Event not found');
          } else {
            res.send(findEvent);
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
      const newEvent = await Events.create({
        user:req.user.id,
        title: req.body.title,
        description: req.body.description,
       })
  } catch (error) {
    //console.log(error);
    return res.status(500).json({ error:'server error' });
  }
 res.send('New Event added');
});

//route Delete api/raise/
//desc delete raise by id
//access public
router.delete(
  '/:id', 
  authMiddleware,
  async(req, res) => {
    try {      
        const delEvent= await Events.findOneAndRemove({_id: req.params.id});
        if (!delEvent) {
            return res.status(404).send('Event not found');
          } else {
            res.send("Event deleted");
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
    const updateEvent =await Events.findById(req.body.id)
    if (!updateEvent) {
        return res.status(404).send('Event not found');
      }   
    
      updateEvent.title= req.body.title;
      updateEvent.description= req.body.description;
            
      await updateEvent.save();
      res.send (updateEvent);    
} catch (error) {
  return res.status(500).json({ error: error.message });
}
  
});

module.exports = router;